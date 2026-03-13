import { useState, useEffect } from 'react'
import { useMenuStore } from '../../shared/store'
import DataPortability from './DataPortability'

interface Toast {
  id: number
  message: string
}

export default function StoreInfoForm() {
  const { storeInfo, updateStoreInfo } = useMenuStore()
  const [toasts, setToasts] = useState<Toast[]>([])
  const [toastId, setToastId] = useState(0)

  const showToast = (message: string) => {
    const id = toastId + 1
    setToastId(id)
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2500)
  }

  const handleChange =
    (field: keyof typeof storeInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateStoreInfo({ [field]: e.target.value })
    }

  // 저장 확인 토스트: 변경 감지 (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      showToast('변경사항이 저장되었습니다.')
    }, 1200)
    return () => clearTimeout(timer)
    // storeInfo 변경 시 트리거
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    storeInfo.name,
    storeInfo.slogan,
    storeInfo.hours,
    storeInfo.address,
    storeInfo.instagram,
    storeInfo.notice,
  ])

  return (
    <div className="max-w-xl">
      {/* 토스트 */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-gray-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in"
          >
            <span className="text-green-400">✓</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-5">매장 정보</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {/* 바 이름 */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            바 이름
          </label>
          <input
            type="text"
            value={storeInfo.name}
            onChange={handleChange('name')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            placeholder="ex) CAMBRE"
          />
        </div>

        {/* 슬로건 */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            슬로건
          </label>
          <input
            type="text"
            value={storeInfo.slogan}
            onChange={handleChange('slogan')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            placeholder="ex) Craft Cocktail Bar"
          />
        </div>

        {/* 영업시간 */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            영업시간
          </label>
          <input
            type="text"
            value={storeInfo.hours}
            onChange={handleChange('hours')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            placeholder="ex) MON-SAT 18:00 — 02:00"
          />
        </div>

        {/* 주소 */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            주소
          </label>
          <input
            type="text"
            value={storeInfo.address}
            onChange={handleChange('address')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            placeholder="ex) 서울시 마포구 어딘가"
          />
        </div>

        {/* 인스타그램 */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            인스타그램
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-gray-900 transition">
            <span className="px-3 py-2 bg-gray-50 text-gray-400 text-sm border-r border-gray-300 select-none">
              @
            </span>
            <input
              type="text"
              value={storeInfo.instagram}
              onChange={handleChange('instagram')}
              className="flex-1 px-3 py-2 text-sm focus:outline-none"
              placeholder="username"
            />
          </div>
        </div>

        {/* 공지사항 */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            공지사항
          </label>
          <textarea
            value={storeInfo.notice}
            onChange={handleChange('notice')}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition resize-none"
            placeholder="고객에게 안내할 내용을 입력하세요."
          />
        </div>
      </div>

      {/* 데이터 이식성 섹션 */}
      <DataPortability />
    </div>
  )
}
