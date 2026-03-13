import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import MenuManagement from './components/MenuManagement'
import CategoryManagement from './components/CategoryManagement'
import StoreInfoForm from './components/StoreInfoForm'

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
