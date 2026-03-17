import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import ClientPage from './client/ClientPage'
import AdminPage from './admin/AdminPage'
import { initFromServer } from './shared/store'

// 서버 실행 중이면 data/menu.json 데이터로 초기화 (없으면 localStorage 유지)
initFromServer()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<ClientPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
