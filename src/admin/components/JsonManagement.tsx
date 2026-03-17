import { useEffect, useState } from 'react'
import { useMenuStore } from '../../shared/store'

type MessageType = 'success' | 'error' | null

export default function JsonManagement() {
  const { exportData, importData } = useMenuStore()
  const [jsonText, setJsonText] = useState('')
  const [originalJson, setOriginalJson] = useState('')
  const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null)
  const [isModified, setIsModified] = useState(false)

  const loadCurrentData = () => {
    const json = exportData()
    setJsonText(json)
    setOriginalJson(json)
    setIsModified(false)
  }

  useEffect(() => {
    loadCurrentData()
  }, [])

  const showMessage = (type: MessageType, text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setJsonText(val)
    setIsModified(val !== originalJson)
  }

  const handleApply = () => {
    try {
      JSON.parse(jsonText) // 유효성 검사
      importData(jsonText)
      const updated = exportData()
      setOriginalJson(updated)
      setJsonText(updated)
      setIsModified(false)
      showMessage('success', 'JSON이 성공적으로 적용되었습니다.')
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
    navigator.clipboard.writeText(jsonText).then(() => {
      showMessage('success', '클립보드에 복사되었습니다.')
    }).catch(() => {
      showMessage('error', '복사에 실패했습니다.')
    })
  }

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText)
      const formatted = JSON.stringify(parsed, null, 2)
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

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-800">JSON 데이터 관리</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            메뉴·카테고리·매장정보를 JSON으로 직접 편집하고 적용할 수 있습니다.
          </p>
        </div>

        {isModified && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            미적용 변경사항 있음
          </span>
        )}
      </div>

      {/* 액션 버튼 바 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleFormat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>{ }</span>
          <span>정렬</span>
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>⎘</span>
          <span>복사</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>↓</span>
          <span>다운로드</span>
        </button>
        <button
          onClick={loadCurrentData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>↺</span>
          <span>새로고침</span>
        </button>
      </div>

      {/* 메시지 */}
      {message && (
        <div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          <span>{message.type === 'success' ? '✓' : '✕'}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* JSON 에디터 */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* 에디터 헤더 */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-xs text-gray-400 font-mono">cambre-data.json</span>
          <span className="text-xs text-gray-500">{lineCount}줄</span>
        </div>

        {/* 텍스트 에디터 */}
        <div className="relative">
          <textarea
            value={jsonText}
            onChange={handleChange}
            spellCheck={false}
            className="w-full h-[60vh] min-h-[400px] px-4 py-3 bg-gray-900 text-green-400 font-mono text-xs leading-5 resize-none outline-none placeholder:text-gray-600"
            style={{ tabSize: 2 }}
          />
        </div>
      </div>

      {/* 하단 적용 버튼 */}
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
