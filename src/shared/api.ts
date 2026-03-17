import type { StoreInfo, MenuItem, Category } from './types'

export interface MenuData {
  storeInfo: StoreInfo
  categories: Category[]
  menuItems: MenuItem[]
}

/** 서버가 실행 중인지 여부 (캐시됨) */
let _serverAvailable: boolean | null = null

export async function checkServerAvailable(): Promise<boolean> {
  if (_serverAvailable !== null) return _serverAvailable
  try {
    const res = await fetch('/api/data', {
      signal: AbortSignal.timeout(1500),
    })
    _serverAvailable = res.ok || res.status === 404 // 404도 서버가 살아있는 것
    return _serverAvailable
  } catch {
    _serverAvailable = false
    return false
  }
}

/** 서버에서 메뉴 데이터 읽기 */
export async function fetchServerData(): Promise<MenuData | null> {
  try {
    const res = await fetch('/api/data', {
      signal: AbortSignal.timeout(2000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/** 서버에 메뉴 데이터 저장 */
export async function saveToServer(data: MenuData): Promise<boolean> {
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

/** 서버 가용성 캐시 초기화 (재확인용) */
export function resetServerCache() {
  _serverAvailable = null
}
