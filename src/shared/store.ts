import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StoreInfo, MenuItem, Category, ThemeId } from './types'
import { initialStoreInfo, initialCategories, initialMenuItems } from './mockData'
import { fetchData, saveData, detectBackend } from './api'

interface MenuStore {
  storeInfo: StoreInfo
  categories: Category[]
  menuItems: MenuItem[]

  // StoreInfo actions
  updateStoreInfo: (info: Partial<StoreInfo>) => void
  setTheme: (themeId: ThemeId) => void

  // Category actions
  addCategory: (category: Category) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  reorderCategories: (categories: Category[]) => void

  // MenuItem actions
  addMenuItem: (item: MenuItem) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  reorderMenuItems: (items: MenuItem[]) => void
  toggleMenuItemVisibility: (id: string) => void

  // Data portability
  exportData: () => string
  importData: (json: string) => void
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set, get) => ({
      storeInfo: initialStoreInfo,
      categories: initialCategories,
      menuItems: initialMenuItems,

      updateStoreInfo: (info) =>
        set((state) => ({ storeInfo: { ...state.storeInfo, ...info } })),

      setTheme: (themeId) =>
        set((state) => ({ storeInfo: { ...state.storeInfo, activeTheme: themeId } })),

      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),

      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          menuItems: state.menuItems.filter((m) => m.categoryId !== id),
        })),

      reorderCategories: (categories) => set({ categories }),

      addMenuItem: (item) =>
        set((state) => ({ menuItems: [...state.menuItems, item] })),

      updateMenuItem: (id, updates) =>
        set((state) => ({
          menuItems: state.menuItems.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      deleteMenuItem: (id) =>
        set((state) => ({
          menuItems: state.menuItems.filter((m) => m.id !== id),
        })),

      reorderMenuItems: (items) =>
        set((state) => {
          const otherItems = state.menuItems.filter(
            (m) => !items.some((i) => i.id === m.id)
          )
          return { menuItems: [...items, ...otherItems] }
        }),

      toggleMenuItemVisibility: (id) =>
        set((state) => ({
          menuItems: state.menuItems.map((m) =>
            m.id === id ? { ...m, isVisible: !m.isVisible } : m
          ),
        })),

      exportData: () => {
        const { storeInfo, categories, menuItems } = get()
        return JSON.stringify({ storeInfo, categories, menuItems }, null, 2)
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json) as {
            storeInfo: StoreInfo
            categories: Category[]
            menuItems: MenuItem[]
          }
          set({
            storeInfo: data.storeInfo ?? initialStoreInfo,
            categories: data.categories ?? initialCategories,
            menuItems: data.menuItems ?? initialMenuItems,
          })
        } catch {
          alert('JSON 파일 형식이 올바르지 않습니다.')
        }
      },
    }),
    {
      name: 'cambre-menu-store',
    }
  )
)

// ─── 백엔드 자동 동기화 ───────────────────────────────────────
// 상태 변경 시 로컬서버 or JSONbin에 자동 저장 (debounce 300ms)
let _syncTimer: ReturnType<typeof setTimeout> | null = null
let _isSyncing = false

async function syncToBackend() {
  if (_isSyncing) return
  const backend = await detectBackend()
  if (backend === 'localStorage') return // localStorage는 persist가 처리

  _isSyncing = true
  try {
    const { storeInfo, categories, menuItems } = useMenuStore.getState()
    await saveData({ storeInfo, categories, menuItems })
  } finally {
    _isSyncing = false
  }
}

useMenuStore.subscribe(() => {
  if (_isSyncing) return
  if (_syncTimer) clearTimeout(_syncTimer)
  _syncTimer = setTimeout(syncToBackend, 300)
})

// ─── 앱 시작 시 초기화 ────────────────────────────────────────
/**
 * 앱 시작 시 데이터 소스 우선순위:
 * 1. 로컬 서버 (npm run server) → data/menu.json
 * 2. JSONbin.io → 클라우드 JSON (GitHub Pages에서도 동작)
 * 3. localStorage (폴백)
 */
export async function initFromServer(): Promise<boolean> {
  const data = await fetchData()
  if (!data) return false

  _isSyncing = true
  try {
    useMenuStore.getState().importData(JSON.stringify(data))
  } finally {
    _isSyncing = false
  }
  return true
}

export { detectBackend }
