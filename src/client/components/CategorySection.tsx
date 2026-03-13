import React, { useState } from 'react'
import type { Category, MenuItem } from '../../shared/types'
import MenuItemCard from './MenuItemCard'
import MenuDetailModal from './MenuDetailModal'

interface CategorySectionProps {
  category: Category
  menuItems: MenuItem[]
}

/* ── SVG 아이콘 ──────────────────────────────────────────── */

function CocktailIcon() {
  return (
    <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* 마티니잔 실루엣 */}
      <path
        d="M2 4 L34 4 L20 24 L20 38 L25 38 L25 42 L11 42 L11 38 L16 38 L16 24 Z"
        fill="var(--ink)"
        fillOpacity="0.15"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line x1="2" y1="4" x2="34" y2="4" stroke="var(--ink)" strokeWidth="1.5" />
    </svg>
  )
}

function ClassicIcon() {
  return (
    <svg width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* 위스키잔 (올드패션드 스타일) */}
      <rect x="5" y="10" width="22" height="30" rx="2" fill="var(--ink)" fillOpacity="0.12" stroke="var(--ink)" strokeWidth="1.5" />
      {/* 얼음/내용물 표시 */}
      <line x1="5" y1="22" x2="27" y2="22" stroke="var(--ink)" strokeWidth="1" strokeDasharray="3 2" />
      {/* 잔 받침 */}
      <rect x="3" y="40" width="26" height="3" rx="1" fill="var(--ink)" fillOpacity="0.3" stroke="var(--ink)" strokeWidth="1" />
    </svg>
  )
}

function NonAlcoholIcon() {
  return (
    <svg width="28" height="44" viewBox="0 0 28 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* 레모네이드/주스잔 */}
      <path
        d="M4 8 L6 38 L22 38 L24 8 Z"
        fill="var(--ink)"
        fillOpacity="0.12"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 빨대 */}
      <line x1="18" y1="6" x2="14" y2="38" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
      {/* 레몬 슬라이스 힌트 */}
      <circle cx="8" cy="12" r="3.5" fill="none" stroke="var(--sepia)" strokeWidth="1" />
      <line x1="8" y1="8.5" x2="8" y2="15.5" stroke="var(--sepia)" strokeWidth="0.8" />
      <line x1="4.5" y1="12" x2="11.5" y2="12" stroke="var(--sepia)" strokeWidth="0.8" />
      {/* 잔 받침 */}
      <rect x="2" y="38" width="24" height="3" rx="1" fill="var(--ink)" fillOpacity="0.25" stroke="var(--ink)" strokeWidth="1" />
    </svg>
  )
}

function FoodIcon() {
  return (
    <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* 접시 */}
      <ellipse cx="18" cy="30" rx="14" ry="6" fill="var(--ink)" fillOpacity="0.1" stroke="var(--ink)" strokeWidth="1.5" />
      <ellipse cx="18" cy="30" rx="10" ry="4" fill="none" stroke="var(--ink)" strokeWidth="0.8" strokeDasharray="2 2" />
      {/* 포크 */}
      <line x1="8" y1="8" x2="8" y2="26" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="8" x2="6" y2="15" stroke="var(--ink)" strokeWidth="1" strokeLinecap="round" />
      <line x1="10" y1="8" x2="10" y2="15" stroke="var(--ink)" strokeWidth="1" strokeLinecap="round" />
      {/* 나이프 */}
      <line x1="28" y1="8" x2="28" y2="26" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 8 Q31 12 28 18" fill="none" stroke="var(--ink)" strokeWidth="1" />
    </svg>
  )
}

const iconMap: Record<Category['icon'], React.ReactElement> = {
  cocktail: <CocktailIcon />,
  classic: <ClassicIcon />,
  nonalcohol: <NonAlcoholIcon />,
  food: <FoodIcon />,
}

/* ─────────────────────────────────────────────────────────── */

export default function CategorySection({ category, menuItems }: CategorySectionProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const visibleItems = menuItems.filter((m) => m.isVisible)

  return (
    <>
      <section
        id={`category-section-${category.id}`}
        style={{
          backgroundColor: 'var(--paper)',
          paddingTop: '4px',
          scrollMarginTop: '48px', // sticky nav 높이만큼 오프셋
        }}
      >
        {/* 섹션 헤더 */}
        <div
          style={{
            margin: '0 12px',
            borderLeft: '4px solid var(--ink)',
            borderRight: '4px solid var(--ink)',
            borderTop: '4px solid var(--ink)',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--ink)',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            {/* SVG 아이콘 (색반전용 필터) */}
            <div
              style={{
                filter: 'invert(1) brightness(2)',
                opacity: 0.85,
                flexShrink: 0,
              }}
            >
              {iconMap[category.icon]}
            </div>

            <div>
              <h2
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontWeight: 900,
                  fontSize: '20px',
                  color: 'var(--paper)',
                  letterSpacing: '0.04em',
                  lineHeight: 1.2,
                }}
              >
                {category.name}
              </h2>
              <p
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontWeight: 400,
                  fontSize: '11px',
                  color: 'rgba(245,230,200,0.7)',
                  letterSpacing: '0.18em',
                  marginTop: '2px',
                }}
              >
                {category.nameEn}
              </p>
            </div>
          </div>
        </div>

        {/* 메뉴 그리드 */}
        <div
          style={{
            margin: '0 12px',
            border: '1.5px solid var(--ink)',
            borderTop: 'none',
            padding: '4px 12px 12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0 8px',
          }}
        >
          {visibleItems.length === 0 ? (
            <p
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center' as const,
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: '13px',
                color: 'var(--sepia)',
                padding: '24px 0',
              }}
            >
              등록된 메뉴가 없습니다.
            </p>
          ) : (
            visibleItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onOpen={setSelectedItem} />
            ))
          )}
        </div>

        {/* 섹션 하단 여백 */}
        <div style={{ height: '20px' }} />
      </section>

      {selectedItem && (
        <MenuDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  )
}
