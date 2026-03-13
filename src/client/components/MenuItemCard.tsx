import React from 'react'
import type { MenuItem } from '../../shared/types'

interface MenuItemCardProps {
  item: MenuItem
  onOpen: (item: MenuItem) => void
}

const badgeColors: Record<string, React.CSSProperties> = {
  NEW: {
    backgroundColor: 'var(--ink)',
    color: 'var(--paper)',
  },
  BEST: {
    backgroundColor: 'var(--sepia)',
    color: 'var(--paper)',
  },
}

export default function MenuItemCard({ item, onOpen }: MenuItemCardProps) {
  const isSoldOut = item.badge === 'SOLD_OUT'

  return (
    <div
      onClick={() => !isSoldOut && onOpen(item)}
      style={{
        padding: '10px 4px',
        borderBottom: '1px dashed var(--sepia)',
        cursor: isSoldOut ? 'default' : 'pointer',
        opacity: isSoldOut ? 0.45 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {/* 이름 + 가격 라인 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px',
        }}
      >
        <span
          style={{
            fontFamily: "'Noto Serif KR', serif",
            fontWeight: 700,
            fontSize: '14px',
            color: 'var(--ink)',
            whiteSpace: 'nowrap' as const,
            textDecoration: isSoldOut ? 'line-through' : 'none',
            flexShrink: 0,
          }}
        >
          {item.name}
        </span>

        {/* 점선 채우기 */}
        <span
          style={{
            flex: 1,
            borderBottom: '1.5px dotted var(--sepia)',
            marginBottom: '3px',
            minWidth: '12px',
          }}
        />

        <span
          style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            color: 'var(--ink)',
            whiteSpace: 'nowrap' as const,
            flexShrink: 0,
          }}
        >
          {item.price.toLocaleString()}원
        </span>
      </div>

      {/* 뱃지 행 */}
      {item.badge && item.badge !== 'SOLD_OUT' && (
        <div style={{ marginTop: '4px', display: 'flex', gap: '4px' }}>
          <span
            style={{
              ...badgeColors[item.badge],
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 700,
              fontSize: '10px',
              padding: '1px 5px',
              letterSpacing: '0.06em',
            }}
          >
            {item.badge}
          </span>
        </div>
      )}

      {isSoldOut && (
        <div style={{ marginTop: '4px' }}>
          <span
            style={{
              backgroundColor: 'var(--ink-light)',
              color: 'var(--paper)',
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 700,
              fontSize: '10px',
              padding: '1px 5px',
              letterSpacing: '0.06em',
            }}
          >
            SOLD OUT
          </span>
        </div>
      )}

      {/* 설명 2줄 말줄임 */}
      <p
        style={{
          marginTop: '4px',
          fontFamily: "'Noto Sans KR', sans-serif",
          fontSize: '11px',
          color: 'var(--ink-light)',
          lineHeight: 1.55,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
          textDecoration: isSoldOut ? 'line-through' : 'none',
        }}
      >
        {item.description}
      </p>
    </div>
  )
}
