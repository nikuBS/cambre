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
import type { Category } from '../../shared/types'

const ICON_OPTIONS: Category['icon'][] = ['cocktail', 'classic', 'nonalcohol', 'food']

// ── SortableCategoryRow ────────────────────────────────────────────────────

interface SortableCategoryRowProps {
  category: Category
  onUpdate: (id: string, updates: Partial<Category>) => void
  onDelete: (id: string) => void
}

function SortableCategoryRow({ category, onUpdate, onDelete }: SortableCategoryRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? '#f9fafb' : undefined,
  }

  const [editField, setEditField] = useState<'name' | 'nameEn' | null>(null)
  const [tempValue, setTempValue] = useState('')

  const startEdit = (field: 'name' | 'nameEn') => {
    setEditField(field)
    setTempValue(category[field])
  }

  const commitEdit = () => {
    if (editField) {
      const trimmed = tempValue.trim()
      if (trimmed) {
        onUpdate(category.id, { [editField]: trimmed })
      }
      setEditField(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditField(null)
  }

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-gray-100 hover:bg-gray-50 group">
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

      {/* 이름 (인라인 편집) */}
      <td className="px-3 py-3" onClick={() => editField !== 'name' && startEdit('name')}>
        {editField === 'name' ? (
          <input
            autoFocus
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-sm text-gray-800 cursor-pointer hover:underline decoration-dashed underline-offset-2">
            {category.name}
          </span>
        )}
      </td>

      {/* 영문명 (인라인 편집) */}
      <td className="px-3 py-3" onClick={() => editField !== 'nameEn' && startEdit('nameEn')}>
        {editField === 'nameEn' ? (
          <input
            autoFocus
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-sm text-gray-500 cursor-pointer hover:underline decoration-dashed underline-offset-2">
            {category.nameEn || '—'}
          </span>
        )}
      </td>

      {/* 아이콘 */}
      <td className="px-3 py-3">
        <select
          value={category.icon}
          onChange={(e) => onUpdate(category.id, { icon: e.target.value as Category['icon'] })}
          className="border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          {ICON_OPTIONS.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
      </td>

      {/* 노출 토글 */}
      <td className="px-3 py-3">
        <button
          onClick={() => onUpdate(category.id, { isVisible: !category.isVisible })}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
            category.isVisible ? 'bg-gray-900' : 'bg-gray-200'
          }`}
          aria-label="노출 토글"
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
              category.isVisible ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </td>

      {/* 삭제 */}
      <td className="px-3 py-3">
        <button
          onClick={() => {
            if (confirm(`"${category.name}" 카테고리와 포함된 메뉴를 모두 삭제하시겠습니까?`)) {
              onDelete(category.id)
            }
          }}
          className="text-xs px-2.5 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
        >
          삭제
        </button>
      </td>
    </tr>
  )
}

// ── AddCategoryRow ────────────────────────────────────────────────────────────

interface AddCategoryRowProps {
  onAdd: (category: Omit<Category, 'id' | 'order'>) => void
  onCancel: () => void
  nextOrder: number
}

function AddCategoryRow({ onAdd, onCancel }: AddCategoryRowProps) {
  const [name, setName] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [icon, setIcon] = useState<Category['icon']>('cocktail')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({ name: name.trim(), nameEn: nameEn.trim(), icon, isVisible: true })
  }

  return (
    <tr className="border-b border-blue-100 bg-blue-50">
      <td className="pl-4 pr-2 py-3"></td>
      <td className="px-3 py-3">
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="카테고리명"
          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </td>
      <td className="px-3 py-3">
        <input
          type="text"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="English name"
          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </td>
      <td className="px-3 py-3">
        <select
          value={icon}
          onChange={(e) => setIcon(e.target.value as Category['icon'])}
          className="border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-600 focus:outline-none bg-white"
        >
          {ICON_OPTIONS.map((ic) => (
            <option key={ic} value={ic}>
              {ic}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-3"></td>
      <td className="px-3 py-3">
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="text-xs px-2.5 py-1 rounded text-white font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            추가
          </button>
          <button
            onClick={onCancel}
            className="text-xs px-2.5 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            취소
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── CategoryManagement ────────────────────────────────────────────────────────

export default function CategoryManagement() {
  const { categories, addCategory, updateCategory, deleteCategory, reorderCategories } =
    useMenuStore()
  const [showAddRow, setShowAddRow] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = categories.findIndex((c) => c.id === active.id)
    const newIndex = categories.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(categories, oldIndex, newIndex).map((c, i) => ({
      ...c,
      order: i,
    }))
    reorderCategories(reordered)
  }

  const handleAdd = (data: Omit<Category, 'id' | 'order'>) => {
    addCategory({
      id: crypto.randomUUID(),
      order: categories.length,
      ...data,
    })
    setShowAddRow(false)
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">카테고리 목록</h2>
        <button
          onClick={() => setShowAddRow(true)}
          disabled={showAddRow}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium transition-colors hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <span>+</span>
          <span>카테고리 추가</span>
        </button>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        행을 드래그하여 순서를 변경하거나, 이름/영문명을 클릭하면 인라인 편집됩니다.
      </p>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[560px]">
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
                  아이콘
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
                  items={categories.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {categories.map((category) => (
                    <SortableCategoryRow
                      key={category.id}
                      category={category}
                      onUpdate={updateCategory}
                      onDelete={deleteCategory}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {showAddRow && (
                <AddCategoryRow
                  nextOrder={categories.length}
                  onAdd={handleAdd}
                  onCancel={() => setShowAddRow(false)}
                />
              )}

              {categories.length === 0 && !showAddRow && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                    카테고리가 없습니다.
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
