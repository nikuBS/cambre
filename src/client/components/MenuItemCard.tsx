import type { MenuItem } from '../../shared/types'

interface MenuItemCardProps {
  item: MenuItem
  onOpen: (item: MenuItem) => void
}

/* 배지별 CSS 변수 매핑 */
const badgeCssVar: Record<string, string> = {
  NEW:  'var(--badge-new)',
  BEST: 'var(--badge-best)',
}

export default function MenuItemCard({ item, onOpen }: MenuItemCardProps) {
  const isSoldOut = item.badge === 'SOLD_OUT'
  const stampBadge = item.badge && item.badge !== 'SOLD_OUT' ? item.badge : null
  // 배지가 있으면 paddingLeft 22px를 확보해야 하므로 폰트를 12px로 축소
  const rowFontSize = stampBadge ? '12px' : '13px'

  return (
    <div
      onClick={() => !isSoldOut && onOpen(item)}
      style={{
        position: 'relative',
        padding: '10px 4px',
        borderBottom: '1px dashed var(--sepia)',
        cursor: isSoldOut ? 'default' : 'pointer',
        opacity: isSoldOut ? 0.5 : 1,
        transition: 'opacity 0.15s',
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {/* ── BEST / NEW 이름줄 앞 스탬프 (레이아웃 공간 미차지) ── */}
      {stampBadge && (
        <span
          style={{
            position: 'absolute',
            top: '6px',
            left: '2px',
            backgroundColor: badgeCssVar[stampBadge],
            color: 'var(--badge-text)',
            fontFamily: "'Noto Sans KR', sans-serif",
            fontWeight: 900,
            fontSize: '7px',
            padding: '1px 3px',
            letterSpacing: '0.08em',
            transform: 'rotate(-12deg)',
            transformOrigin: 'left center',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 2,
            lineHeight: 1.4,
          }}
        >
          {stampBadge}
        </span>
      )}

      {/* ── 이름 + 점선 + 가격 ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px',
          paddingLeft: stampBadge ? '22px' : '0', // 스탬프 영역 확보
        }}
      >
        <span
          style={{
            fontFamily: "'Noto Serif KR', serif",
            fontWeight: 700,
            fontSize: rowFontSize,
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
            minWidth: '8px',
          }}
        />

        <span
          style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontWeight: 700,
            fontSize: rowFontSize,
            color: 'var(--ink)',
            whiteSpace: 'nowrap' as const,
            flexShrink: 0,
          }}
        >
          {item.price.toLocaleString()}원
        </span>
      </div>

      {/* ── 설명 2줄 말줄임 ── */}
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

      {/* ── SOLD OUT 대각선 스탬프 오버레이 ── */}
      {isSoldOut && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 900,
              fontSize: '12px',
              color: 'var(--ink)',
              letterSpacing: '0.14em',
              border: '2px solid var(--ink)',
              padding: '2px 8px',
              transform: 'rotate(-18deg)',
              opacity: 0.5,
              whiteSpace: 'nowrap' as const,
              userSelect: 'none',
            }}
          >
            SOLD OUT
          </span>
        </div>
      )}
    </div>
  )
}
