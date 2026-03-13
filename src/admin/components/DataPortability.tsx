import { useRef, useState } from 'react'
import { useMenuStore } from '../../shared/store'

type MessageType = 'success' | 'error' | null

export default function DataPortability() {
  const { exportData, importData } = useMenuStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null)

  const showMessage = (type: MessageType, text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleExport = () => {
    try {
      const json = exportData()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cambre-menu-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      showMessage('success', 'JSON 파일이 다운로드되었습니다.')
    } catch {
      showMessage('error', '내보내기에 실패했습니다.')
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      try {
        importData(text)
        showMessage('success', '데이터를 성공적으로 가져왔습니다.')
      } catch {
        showMessage('error', 'JSON 파일 형식이 올바르지 않습니다.')
      }
    }
    reader.onerror = () => {
      showMessage('error', '파일을 읽는 중 오류가 발생했습니다.')
    }
    reader.readAsText(file)

    // 같은 파일 재선택 가능하도록 초기화
    e.target.value = ''
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">데이터 내보내기 / 가져오기</h3>
      <p className="text-xs text-gray-400 mb-4">
        메뉴, 카테고리, 매장정보를 JSON 파일로 백업하거나 복원할 수 있습니다.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span>↓</span>
          <span>JSON 내보내기</span>
        </button>

        <button
          onClick={handleImportClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span>↑</span>
          <span>JSON 가져오기</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* 결과 메시지 */}
      {message && (
        <div
          className={`mt-3 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          <span>{message.type === 'success' ? '✓' : '✕'}</span>
          <span>{message.text}</span>
        </div>
      )}
    </div>
  )
}
