import { useEffect, useRef, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import MenuManagement from './components/MenuManagement'
import CategoryManagement from './components/CategoryManagement'
import StoreInfoForm from './components/StoreInfoForm'
import JsonManagement from './components/JsonManagement'

const ADMIN_PASSWORDS = ['01094925503', '01063002929']

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

    if (ADMIN_PASSWORDS.includes(password)) {
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
      <div className="fixed inset-0 z-[100] overflow-hidden bg-[#120f0b]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,162,104,0.22),_transparent_42%),linear-gradient(135deg,_rgba(255,255,255,0.04),_transparent_55%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,_rgba(201,162,104,0.16),_transparent)]" />

        <div className="relative flex min-h-screen items-center justify-center px-5 py-10">
          <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-white/95 shadow-[0_32px_90px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="border-b border-black/5 bg-[linear-gradient(135deg,_#1a1a1a,_#2c241c)] px-7 py-6 text-white">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold tracking-[0.38em] text-white/65">CAMBRE ADMIN</p>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] tracking-[0.28em] text-white/70">
                  PRIVATE
                </span>
              </div>

              <div className="mt-6 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-2xl shadow-inner">
                  ▣
                </div>
                <div>
                  <h1 className="text-[28px] font-black leading-tight">관리자 비밀번호를 입력해주세요.</h1>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    어드민 페이지는 진입할 때마다 비밀번호를 다시 확인합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-7 py-7">
              <div className="mb-6 rounded-[1.5rem] border border-[#d8c3a1] bg-[#f7efe1] px-4 py-4 text-sm leading-6 text-[#5f4b34]">
                <p className="font-semibold tracking-[0.16em] text-[#8b6a40]">SECURITY NOTICE</p>
                <p className="mt-2">
                  보안을 위해 어드민 페이지에 들어올 때마다 비밀번호 확인이 필요합니다.
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold tracking-[0.08em] text-gray-700">비밀번호</span>
                  <div className="rounded-[1.6rem] border border-gray-300 bg-white p-1 shadow-[0_10px_24px_rgba(26,26,26,0.06)] transition focus-within:border-[#8b6a40] focus-within:shadow-[0_14px_34px_rgba(139,106,64,0.18)]">
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
                      className="w-full rounded-[1.3rem] border-0 bg-transparent px-4 py-4 text-center text-lg font-semibold tracking-[0.32em] text-gray-900 outline-none placeholder:tracking-[0.08em] placeholder:text-gray-400"
                      placeholder="비밀번호를 입력하세요"
                      autoComplete="off"
                    />
                  </div>
                </label>

                {errorMessage ? (
                  <p className="rounded-[1.4rem] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
                    {errorMessage}
                  </p>
                ) : (
                  <p className="px-1 text-xs tracking-[0.08em] text-gray-400">
                    숫자 비밀번호를 입력한 뒤 관리자 페이지를 열어주세요.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-[1.4rem] bg-[linear-gradient(135deg,_#1a1a1a,_#3c2f22)] px-4 py-4 text-sm font-semibold tracking-[0.14em] text-white shadow-[0_18px_40px_rgba(26,26,26,0.28)] transition hover:scale-[1.01] hover:shadow-[0_24px_46px_rgba(26,26,26,0.35)]"
                >
                  관리자 페이지 열기
                </button>
              </form>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5 text-xs tracking-[0.08em] text-gray-400">
                <span>CAMBRE BAR CONTROL PANEL</span>
                <span>AUTHORIZED ACCESS ONLY</span>
              </div>
            </div>
          </div>
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
        <Route path="json" element={<JsonManagement />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  )
}
