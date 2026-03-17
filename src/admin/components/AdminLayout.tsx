import { NavLink, Link, useLocation } from 'react-router-dom'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { to: '/admin', label: '메뉴관리', icon: '☰', end: true },
  { to: '/admin/categories', label: '카테고리관리', icon: '◈', end: false },
  { to: '/admin/store', label: '매장정보', icon: '⊙', end: false },
  { to: '/admin/preview', label: '미리보기', icon: '⊡', end: false },
  { to: '/admin/json', label: 'JSON관리', icon: '{ }', end: false },
]

const pageTitles: Record<string, string> = {
  '/admin': '메뉴관리',
  '/admin/categories': '카테고리관리',
  '/admin/store': '매장정보',
  '/admin/preview': '미리보기',
  '/admin/json': 'JSON 관리',
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] ?? '어드민'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 사이드바 (PC/태블릿) */}
      <aside className="hidden md:flex flex-col w-56 shrink-0" style={{ backgroundColor: '#1a1a1a' }}>
        {/* 로고 */}
        <div className="px-6 py-5 border-b border-gray-700">
          <span className="text-white text-sm font-bold tracking-widest">CAMBRE ADMIN</span>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-white text-gray-900 font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* 하단: 고객 페이지 보기 */}
        <div className="px-3 py-4 border-t border-gray-700">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <span className="text-base">↗</span>
            <span>고객 페이지 보기</span>
          </Link>
        </div>
      </aside>

      {/* 메인 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 상단바 */}
        <header className="shrink-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-base font-semibold text-gray-800">{pageTitle}</h1>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"></span>
            <span>자동저장됨 · 방금 전</span>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 overflow-auto p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* 모바일 하단 탭바 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2.5 text-xs transition-colors ${
                isActive ? 'text-gray-900 font-semibold' : 'text-gray-400'
              }`
            }
          >
            <span className="text-lg mb-0.5">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
