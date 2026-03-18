import { useEffect, useState } from 'react'
import { useMenuStore, detectBackend } from '../../shared/store'
import { testJsonbinConnection, resetBackendCache, type BackendType, type DiagResult } from '../../shared/api'

type MessageType = 'success' | 'error' | null

export default function JsonManagement() {
  const { exportData, importData } = useMenuStore()
  const [jsonText, setJsonText] = useState('')
  const [originalJson, setOriginalJson] = useState('')
  const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null)
  const [isModified, setIsModified] = useState(false)
  const [backend, setBackend] = useState<BackendType | null>(null)
  const [diagResult, setDiagResult] = useState<DiagResult | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const loadCurrentData = () => {
    const json = exportData()
    setJsonText(json)
    setOriginalJson(json)
    setIsModified(false)
  }

  useEffect(() => {
    loadCurrentData()
    detectBackend().then(setBackend)
  }, [])

  const handleTestConnection = async () => {
    setIsTesting(true)
    setDiagResult(null)
    resetBackendCache()
    const result = await testJsonbinConnection()
    setDiagResult(result)
    const detected = await detectBackend()
    setBackend(detected)
    setIsTesting(false)
  }

  const showMessage = (type: MessageType, text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setJsonText(val)
    setIsModified(val !== originalJson)
  }

  const handleApply = () => {
    try {
      JSON.parse(jsonText)
      importData(jsonText)
      const updated = exportData()
      setOriginalJson(updated)
      setJsonText(updated)
      setIsModified(false)
      showMessage('success', backend === 'jsonbin' ? 'JSONbin에 저장되었습니다.' : backend === 'local' ? '로컬 서버에 저장되었습니다.' : '로컬에 적용되었습니다.')
    } catch {
      showMessage('error', 'JSON 형식이 올바르지 않습니다. 수정 후 다시 시도하세요.')
    }
  }

  const handleReset = () => {
    setJsonText(originalJson)
    setIsModified(false)
    setMessage(null)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText).then(
      () => showMessage('success', '클립보드에 복사되었습니다.'),
      () => showMessage('error', '복사에 실패했습니다.')
    )
  }

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(jsonText), null, 2)
      setJsonText(formatted)
      setIsModified(formatted !== originalJson)
    } catch {
      showMessage('error', 'JSON 형식이 올바르지 않습니다.')
    }
  }

  const handleDownload = () => {
    try {
      JSON.parse(jsonText)
      const blob = new Blob([jsonText], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cambre-menu-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      showMessage('success', 'JSON 파일이 다운로드되었습니다.')
    } catch {
      showMessage('error', 'JSON 형식이 올바르지 않습니다.')
    }
  }

  const lineCount = jsonText.split('\n').length

  const backendBadge = {
    local: { label: '🟢 로컬 서버', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    jsonbin: { label: '🟣 JSONbin.io', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
    localStorage: { label: '🟡 localStorage', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  }
  const badge = backend ? backendBadge[backend] : null

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 헤더 */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-800">JSON 데이터 관리</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            메뉴·카테고리·매장정보를 JSON으로 직접 편집하고 적용할 수 있습니다.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {badge && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badge.cls}`}>
              {badge.label}
            </span>
          )}
          {isModified && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              ● 미적용 변경사항
            </span>
          )}
        </div>
      </div>

      {/* JSONbin 미설정 안내 */}
      {backend === 'localStorage' && (
        <div className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-4 text-sm space-y-3">
          <div>
            <p className="font-semibold text-purple-800 mb-2">📦 JSONbin.io 설정하면 GitHub Pages에서도 실시간 동기화됩니다</p>
            <ol className="text-xs text-purple-700 space-y-1 leading-5 list-decimal list-inside">
              <li>프로젝트 루트의 <code className="bg-purple-100 px-1 rounded">.env.local</code> 파일에 아래 값을 입력하고 값은 <strong>반드시 따옴표로 감싸세요:</strong></li>
            </ol>
            <pre className="mt-2 bg-purple-100 rounded-lg px-3 py-2 text-xs text-purple-900 font-mono overflow-x-auto">{`VITE_JSONBIN_KEY="your_key_here"
VITE_JSONBIN_ID="your_bin_id_here"`}</pre>
            <p className="text-xs text-purple-600 mt-2">GitHub Pages 배포 시에는 레포 Settings → Secrets and variables → Actions에도 동일하게 추가하세요.</p>
          </div>

          {/* 연결 테스트 버튼 */}
          <div className="pt-1 border-t border-purple-200">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors disabled:opacity-60"
            >
              {isTesting ? (
                <><span className="inline-block w-3 h-3 border-2 border-purple-400 border-t-purple-800 rounded-full animate-spin"></span><span>테스트 중...</span></>
              ) : (
                <><span>🔍</span><span>JSONbin 연결 테스트</span></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 진단 결과 */}
      {diagResult && (
        <div className={`rounded-xl border px-4 py-3 text-xs space-y-1.5 ${diagResult.saveOk ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <p className="font-semibold text-sm">{diagResult.saveOk ? '✅ JSONbin 연결 성공!!' : '❌ JSONbin 연결 실패'}</p>
          <div className="space-y-0.5 font-mono">
            <p>{diagResult.hasKey ? '✓' : '✗'} VITE_JSONBIN_KEY {diagResult.hasKey ? '설정됨' : '없음'}</p>
            <p>{diagResult.hasId ? '✓' : '✗'} VITE_JSONBIN_ID {diagResult.hasId ? '설정됨' : '없음'}</p>
            <p>{diagResult.fetchOk ? '✓' : '✗'} 읽기(GET) {diagResult.fetchOk ? '성공' : '실패'}</p>
            <p>{diagResult.saveOk ? '✓' : '✗'} 쓰기(PUT) {diagResult.saveOk ? '성공' : '실패'}</p>
            {diagResult.error && <p className="text-red-600 mt-1">오류: {diagResult.error}</p>}
          </div>
          {diagResult.saveOk && <p className="text-green-600">이제 페이지를 새로고침하면 JSONbin 모드로 전환됩니다.</p>}
        </div>
      )}

      {/* JSONbin 연결됨 안내 */}
      {backend === 'jsonbin' && (
        <div className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-xs text-purple-700 flex items-center gap-2">
          <span>✓</span>
          <span>JSONbin.io 연결됨 — 변경사항이 즉시 저장되어 모든 기기에서 동기화됩니다.</span>
        </div>
      )}

      {/* 로컬 서버 연결됨 안내 */}
      {backend === 'local' && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-700 flex items-center gap-2">
          <span>✓</span>
          <span>로컬 서버 연결됨 — 변경사항이 <code className="bg-emerald-100 px-1 rounded">data/menu.json</code>에 자동 저장됩니다.</span>
        </div>
      )}

      {/* 액션 버튼 바 */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleFormat} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
          <span>{'{}'}</span><span>정렬</span>
        </button>
        <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
          <span>⎘</span><span>복사</span>
        </button>
        <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
          <span>↓</span><span>다운로드</span>
        </button>
        <button onClick={loadCurrentData} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
          <span>↺</span><span>새로고침</span>
        </button>
      </div>

      {/* 메시지 */}
      {message && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          <span>{message.type === 'success' ? '✓' : '✕'}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* JSON 에디터 */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-xs text-gray-400 font-mono">cambre-data.json</span>
          <span className="text-xs text-gray-500">{lineCount}줄</span>
        </div>
        <textarea
          value={jsonText}
          onChange={handleChange}
          spellCheck={false}
          className="w-full h-[55vh] min-h-[360px] px-4 py-3 bg-gray-900 text-green-400 font-mono text-xs leading-5 resize-none outline-none"
          style={{ tabSize: 2 }}
        />
      </div>

      {/* 하단 버튼 */}
      <div className="flex items-center justify-between pt-1 pb-4">
        <button
          onClick={handleReset}
          disabled={!isModified}
          className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          변경 취소
        </button>
        <button
          onClick={handleApply}
          disabled={!isModified}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: isModified ? '#1a1a1a' : '#9ca3af' }}
        >
          ✓ 적용하기
        </button>
      </div>
    </div>
  )
}
