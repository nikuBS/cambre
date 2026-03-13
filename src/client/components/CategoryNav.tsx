import React from 'react'
import type { Category } from '../../shared/types'

interface CategoryNavProps {
  categories: Category[]
  activeCategoryId: string
  onCategoryClick: (categoryId: string) => void
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'sticky' as const,
    top: 0,
    backgroundColor: 'var(--paper)',
    zIndex: 100,
    borderBottom: '2px solid var(--ink)',
    borderTop: '1px solid var(--ink)',
  },
  scrollWrapper: {
    overflowX: 'auto' as const,
    display: 'flex',
    padding: '8px 12px',
    gap: '8px',
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
  },
}

export default function CategoryNav({ categories, activeCategoryId, onCategoryClick }: CategoryNavProps) {
  const handleClick = (categoryId: string) => {
    onCategoryClick(categoryId)
    const el = document.getElementById(`category-section-${categoryId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <style>{`
        .category-nav-scroll::-webkit-scrollbar { display: none; }
        @media print {
          .category-nav { display: none; }
        }
      `}</style>
      <nav style={styles.nav} className="category-nav">
        <div style={styles.scrollWrapper} className="category-nav-scroll">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategoryId
            return (
              <button
                key={cat.id}
                onClick={() => handleClick(cat.id)}
                style={{
                  flexShrink: 0,
                  padding: '5px 14px',
                  fontFamily: "'Noto Serif KR', serif",
                  fontWeight: isActive ? 700 : 400,
                  fontSize: '13px',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  border: '1.5px solid var(--ink)',
                  backgroundColor: isActive ? 'var(--ink)' : 'transparent',
                  color: isActive ? 'var(--paper)' : 'var(--ink)',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap' as const,
                  lineHeight: 1.5,
                }}
              >
                {cat.name}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
