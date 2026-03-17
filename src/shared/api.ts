import type { StoreInfo, MenuItem, Category } from './types'

export interface MenuData {
  storeInfo: StoreInfo
  categories: Category[]
  menuItems: MenuItem[]
}

// ─── 백엔드 타입 ──────────────────────────────────────────────
export type BackendType = 'local' | 'jsonbin' | 'localStorage'

let _detectedBackend: BackendType | null = null

/** 현재 사용 가능한 백엔드 감지 (캐시됨) */
export async function detectBackend(): Promise<BackendType> {
  if (_detectedBackend !== null) return _detectedBackend

  // 1순위: 로컬 서버 (npm run server) — /api/ping 으로만 판단
  try {
    const res = await fetch('/api/ping', { signal: AbortSignal.timeout(1200) })
    if (res.ok) {
      _detectedBackend = 'local'
      return 'local'
    }
  } catch {
    // 로컬 서버 없음 → GitHub Pages의 404와 구분됨
  }

  // 2순위: JSONbin.io (환경변수 설정된 경우)
  if (import.meta.env.VITE_JSONBIN_KEY && import.meta.env.VITE_JSONBIN_ID) {
    _detectedBackend = 'jsonbin'
    return 'jsonbin'
  }

  // 3순위: localStorage 폴백
  _detectedBackend = 'localStorage'
  return 'localStorage'
}

export function resetBackendCache() {
  _detectedBackend = null
}

// ─── 로컬 서버 ────────────────────────────────────────────────
export async function fetchLocalData(): Promise<MenuData | null> {
  try {
    const res = await fetch('/api/data', { signal: AbortSignal.timeout(2000) })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function saveLocalData(data: MenuData): Promise<boolean> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(3000),
    })
    return res.ok
  } catch {
    return false
  }
}

// ─── JSONbin.io ───────────────────────────────────────────────
// 환경변수: VITE_JSONBIN_KEY (Master Key), VITE_JSONBIN_ID (Bin ID)
const JSONBIN_BASE = 'https://api.jsonbin.io/v3/b'

function jsonbinHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Access-Key': import.meta.env.VITE_JSONBIN_KEY ?? '',
  }
}

export async function fetchJsonbinData(): Promise<MenuData | null> {
  const binId = import.meta.env.VITE_JSONBIN_ID
  if (!binId) return null
  try {
    const res = await fetch(`${JSONBIN_BASE}/${binId}/latest`, {
      headers: jsonbinHeaders(),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const json = await res.json()
    return (json as { record: MenuData }).record
  } catch {
    return null
  }
}

export async function saveJsonbinData(data: MenuData): Promise<boolean> {
  const binId = import.meta.env.VITE_JSONBIN_ID
  if (!binId) return false
  try {
    const res = await fetch(`${JSONBIN_BASE}/${binId}`, {
      method: 'PUT',
      headers: jsonbinHeaders(),
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(5000),
    })
    return res.ok
  } catch {
    return false
  }
}

// ─── 통합 인터페이스 (자동 감지) ─────────────────────────────
export async function fetchData(): Promise<MenuData | null> {
  const backend = await detectBackend()
  if (backend === 'local') return fetchLocalData()
  if (backend === 'jsonbin') return fetchJsonbinData()
  return null
}

export async function saveData(data: MenuData): Promise<boolean> {
  const backend = await detectBackend()
  if (backend === 'local') return saveLocalData(data)
  if (backend === 'jsonbin') return saveJsonbinData(data)
  return false
}

// ─── 진단 ─────────────────────────────────────────────────────
export interface DiagResult {
  hasKey: boolean
  hasId: boolean
  fetchOk: boolean
  saveOk: boolean
  error?: string
}

export async function testJsonbinConnection(): Promise<DiagResult> {
  const hasKey = !!(import.meta.env.VITE_JSONBIN_KEY)
  const hasId = !!(import.meta.env.VITE_JSONBIN_ID)

  if (!hasKey || !hasId) {
    return { hasKey, hasId, fetchOk: false, saveOk: false, error: '환경변수 미설정' }
  }

  // 읽기 테스트
  let fetchOk = false
  try {
    const r = await fetch(`${JSONBIN_BASE}/${import.meta.env.VITE_JSONBIN_ID}/latest`, {
      headers: jsonbinHeaders(),
      signal: AbortSignal.timeout(5000),
    })
    fetchOk = r.ok
    if (!r.ok) return { hasKey, hasId, fetchOk, saveOk: false, error: `읽기 실패: HTTP ${r.status}` }
  } catch (e) {
    return { hasKey, hasId, fetchOk, saveOk: false, error: `읽기 오류: ${String(e)}` }
  }

  // 쓰기 테스트 (현재 데이터 그대로 PUT)
  let saveOk = false
  try {
    const current = await fetchJsonbinData()
    if (current) {
      saveOk = await saveJsonbinData(current)
      if (!saveOk) return { hasKey, hasId, fetchOk, saveOk, error: '쓰기 실패 (HTTP 오류)' }
    }
  } catch (e) {
    return { hasKey, hasId, fetchOk, saveOk, error: `쓰기 오류: ${String(e)}` }
  }

  return { hasKey, hasId, fetchOk, saveOk }
}

// ─── 하위 호환 ────────────────────────────────────────────────
export const checkServerAvailable = async () => (await detectBackend()) === 'local'
export const fetchServerData = fetchLocalData
export const saveToServer = saveLocalData
export const resetServerCache = resetBackendCache
