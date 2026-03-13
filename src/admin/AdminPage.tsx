import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import MenuManagement from './components/MenuManagement'
import CategoryManagement from './components/CategoryManagement'
import StoreInfoForm from './components/StoreInfoForm'

const ADMIN_PASSWORD = '01094925503'

function PreviewPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
      <div className="text-4xl">↗</div>
      <h2 className="text-lg font-semibold text-gray-800">고객 페이지 미리보기</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        새 탭에서 고객 페이지를 열어 메뉴판이 어떻게 보이는지 확인하세요.
      </p>
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm text-white font-medium hover:opacity-90 transition-colors"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <span>새 탭에서 열기</span>
        <span>↗</span>
      </a>
    </div>
  )
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const passwordInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    passwordInputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (isAuthenticated) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isAuthenticated])

  const handleUnlock = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setErrorMessage('')
      return
    }

    setPassword('')
    setErrorMessage('비밀번호가 올바르지 않습니다.')
    passwordInputRef.current?.focus()
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5">
        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white p-7 shadow-2xl">
          <div className="mb-5">
            <p className="text-xs font-semibold tracking-[0.3em] text-gray-500">CAMBRE ADMIN</p>
            <h1 className="mt-3 text-2xl font-bold text-gray-900">관리자 비밀번호를 입력해주세요.</h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              보안을 위해 어드민 페이지에 들어올 때마다 비밀번호 확인이 필요합니다.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">비밀번호</span>
              <input
                ref={passwordInputRef}
                type="password"
                inputMode="numeric"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (errorMessage) {
                    setErrorMessage('')
                  }
                }}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                placeholder="비밀번호를 입력하세요"
                autoComplete="off"
              />
            </label>

            {errorMessage && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              관리자 페이지 열기
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<MenuManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="store" element={<StoreInfoForm />} />
        <Route path="preview" element={<PreviewPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  )
}
