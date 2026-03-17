import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMenuStore } from '../../shared/store'
import type { MenuItem, Category } from '../../shared/types'

// ── MenuForm (사이드 패널) ──────────────────────────────────────────────────

interface MenuFormProps {
  categories: Category[]
  editingItem: MenuItem | null
  onClose: () => void
}

const emptyForm = {
  categoryId: '',
  name: '',
  nameEn: '',
  price: 0,
  description: '',
  badge: '' as MenuItem['badge'] | '',
  isVisible: true,
}

function MenuForm({ categories, editingItem, onClose }: MenuFormProps) {
  const { addMenuItem, updateMenuItem } = useMenuStore()
  const [form, setForm] = useState(
    editingItem
      ? {
          categoryId: editingItem.categoryId,
          name: editingItem.name,
          nameEn: editingItem.nameEn,
          price: editingItem.price,
          description: editingItem.description,
          badge: editingItem.badge ?? ('' as MenuItem['badge'] | ''),
          isVisible: editingItem.isVisible,
        }
      : { ...emptyForm, categoryId: categories[0]?.id ?? '' }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const item = {
      ...form,
      badge: form.badge === '' ? undefined : (form.badge as MenuItem['badge']),
    }
    if (editingItem) {
      updateMenuItem(editingItem.id, item)
    } else {
      addMenuItem({
        id: crypto.randomUUID(),
        ...item,
        badge: item.badge,
      })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-800">
            {editingItem ? '메뉴 수정' : '메뉴 추가'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto px-6 py-5 space-y-4">
          {/* 카테고리 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">카테고리</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">이름</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              required
            />
          </div>

          {/* 영문명 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">영문명</label>
            <input
              type="text"
              value={form.nameEn}
              onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* 가격 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">가격 (원)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              min={0}
              required
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">설명</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>

          {/* 뱃지 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">뱃지</label>
            <select
              value={form.badge}
              onChange={(e) =>
                setForm({ ...form, badge: e.target.value as MenuItem['badge'] | '' })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">없음</option>
              <option value="NEW">NEW</option>
              <option value="BEST">BEST</option>
              <option value="SOLD_OUT">SOLD_OUT</option>
            </select>
          </div>

          {/* 노출여부 */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isVisible"
              checked={form.isVisible}
              onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="isVisible" className="text-sm text-gray-700">
              노출 (고객 페이지에 표시)
            </label>
          </div>

          {/* 버튼 - form 안에 포함해 모바일 키보드에 가려지지 않도록 */}
          <div className="flex gap-3 pt-2 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg text-sm text-white font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              {editingItem ? '수정 저장' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── SortableRow ───────────────────────────────────────────────────────────────

interface SortableRowProps {
  item: MenuItem
  categoryName: string
  onEdit: (item: MenuItem) => void
  onDelete: (id: string) => void
  onToggleVisibility: (id: string) => void
}

function SortableRow({
  item,
  categoryName,
  onEdit,
  onDelete,
  onToggleVisibility,
}: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? '#f9fafb' : undefined,
  }

  const badgeColors: Record<NonNullable<MenuItem['badge']>, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    BEST: 'bg-amber-100 text-amber-700',
    SOLD_OUT: 'bg-red-100 text-red-600',
  }

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-gray-100 hover:bg-gray-50">
      {/* 드래그 핸들 */}
      <td className="pl-4 pr-2 py-3 w-8">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-300 hover:text-gray-500 select-none text-lg leading-none block"
          title="드래그하여 순서 변경"
        >
          ⠿
        </span>
      </td>

      {/* 이름 */}
      <td className="px-3 py-3">
        <div className="text-sm font-medium text-gray-800">{item.name}</div>
        <div className="text-xs text-gray-400">{categoryName}</div>
      </td>

      {/* 영문명 */}
      <td className="px-3 py-3 text-sm text-gray-500">{item.nameEn || '—'}</td>

      {/* 가격 */}
      <td className="px-3 py-3 text-sm text-gray-800 tabular-nums">
        {item.price.toLocaleString()}
      </td>

      {/* 뱃지 */}
      <td className="px-3 py-3">
        {item.badge ? (
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${badgeColors[item.badge]}`}
          >
            {item.badge}
          </span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>

      {/* 노출 토글 */}
      <td className="px-3 py-3">
        <button
          onClick={() => onToggleVisibility(item.id)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
            item.isVisible ? 'bg-gray-900' : 'bg-gray-200'
          }`}
          aria-label="노출 토글"
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
              item.isVisible ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </td>

      {/* 액션 */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(item)}
            className="text-xs px-2.5 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            수정
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-xs px-2.5 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
          >
            삭제
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── MenuManagement ────────────────────────────────────────────────────────────

export default function MenuManagement() {
  const { menuItems, categories, deleteMenuItem, reorderMenuItems, toggleMenuItemVisibility } =
    useMenuStore()

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all')
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const filteredItems =
    selectedCategoryId === 'all'
      ? menuItems
      : menuItems.filter((m) => m.categoryId === selectedCategoryId)

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? '—'

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = filteredItems.findIndex((m) => m.id === active.id)
    const newIndex = filteredItems.findIndex((m) => m.id === over.id)
    const reordered = arrayMove(filteredItems, oldIndex, newIndex)
    reorderMenuItems(reordered)
  }

  const handleDelete = (id: string) => {
    if (confirm('메뉴를 삭제하시겠습니까?')) {
      deleteMenuItem(id)
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setPanelOpen(true)
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setPanelOpen(true)
  }

  const handleClosePanel = () => {
    setPanelOpen(false)
    setEditingItem(null)
  }

  return (
    <div>
      {/* 사이드 패널 */}
      {panelOpen && (
        <MenuForm
          categories={categories}
          editingItem={editingItem}
          onClose={handleClosePanel}
        />
      )}

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">메뉴 목록</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <span>+</span>
          <span>메뉴 추가</span>
        </button>
      </div>

      {/* 카테고리 필터 탭 */}
      <div className="flex gap-1 flex-wrap mb-4">
        <button
          onClick={() => setSelectedCategoryId('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            selectedCategoryId === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          전체 ({menuItems.length})
        </button>
        {categories.map((c) => {
          const count = menuItems.filter((m) => m.categoryId === c.id).length
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategoryId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategoryId === c.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.name} ({count})
            </button>
          )
        })}
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="pl-4 pr-2 py-3 w-8"></th>
                <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  이름
                </th>
                <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  영문명
                </th>
                <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  가격
                </th>
                <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  뱃지
                </th>
                <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  노출
                </th>
                <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  액션
                </th>
              </tr>
            </thead>
            <tbody>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredItems.map((m) => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredItems.map((item) => (
                    <SortableRow
                      key={item.id}
                      item={item}
                      categoryName={getCategoryName(item.categoryId)}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleVisibility={toggleMenuItemVisibility}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                    메뉴가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
