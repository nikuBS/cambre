import React, { useEffect } from 'react'
import type { MenuItem } from '../../shared/types'

interface MenuDetailModalProps {
  item: MenuItem
  onClose: () => void
}

const badgeLabel: Record<string, string> = {
  NEW: 'NEW',
  BEST: 'BEST',
  SOLD_OUT: 'SOLD OUT',
}

const badgeStyle: Record<string, React.CSSProperties> = {
  NEW: { backgroundColor: 'var(--ink)', color: 'var(--paper)' },
  BEST: { backgroundColor: 'var(--sepia)', color: 'var(--paper)' },
  SOLD_OUT: { backgroundColor: 'var(--ink-light)', color: 'var(--paper)' },
}

export default function MenuDetailModal({ item, onClose }: MenuDetailModalProps) {
  // body 스크롤 잠금
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // ESC 키 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const isSoldOut = item.badge === 'SOLD_OUT'

  return (
    <>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media print {
          .menu-detail-modal { display: none !important; }
        }
      `}</style>

      {/* 오버레이 */}
      <div
        className="menu-detail-modal"
        onClick={onClose}
        style={{
          position: 'fixed' as const,
          inset: 0,
          backgroundColor: 'rgba(26, 26, 26, 0.72)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          animation: 'modalFadeIn 0.2s ease',
        }}
      >
        {/* 모달 패널 */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'var(--paper)',
            maxWidth: '480px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto' as const,
            animation: 'modalScaleIn 0.22s ease',
          }}
        >
          {/* 이중선 테두리 래퍼 */}
          <div
            style={{
              border: '3px double var(--ink)',
              margin: '10px',
              padding: '0',
            }}
          >
            <div
              style={{
                border: '1px solid var(--ink)',
                margin: '3px',
                padding: '20px 20px 24px',
              }}
            >
              {/* 닫기 버튼 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                <button
                  onClick={onClose}
                  aria-label="닫기"
                  style={{
                    background: 'none',
                    border: '1.5px solid var(--ink)',
                    cursor: 'pointer',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: '14px',
                    color: 'var(--ink)',
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* 영문 서브타이틀 */}
              <p
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontSize: '11px',
                  color: 'var(--sepia)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase' as const,
                  marginBottom: '6px',
                }}
              >
                {item.nameEn}
              </p>

              {/* 메뉴 이름 */}
              <h2
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontWeight: 900,
                  fontSize: 'clamp(22px, 5vw, 28px)',
                  color: 'var(--ink)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                  textDecoration: isSoldOut ? 'line-through' : 'none',
                  marginBottom: '12px',
                }}
              >
                {item.name}
              </h2>

              {/* 구분선 */}
              <div style={{ borderTop: '1px solid var(--ink)', marginBottom: '14px' }} />

              {/* 설명 */}
              <p
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontSize: '13px',
                  color: 'var(--ink-light)',
                  lineHeight: 1.75,
                  marginBottom: '20px',
                }}
              >
                {item.description}
              </p>

              {/* 뱃지 */}
              {item.badge && (
                <div style={{ marginBottom: '16px' }}>
                  <span
                    style={{
                      ...badgeStyle[item.badge],
                      fontFamily: "'Noto Sans KR', sans-serif",
                      fontWeight: 700,
                      fontSize: '11px',
                      padding: '3px 8px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {badgeLabel[item.badge]}
                  </span>
                </div>
              )}

              {/* 구분선 */}
              <div style={{ borderTop: '1px dashed var(--sepia)', marginBottom: '14px' }} />

              {/* 가격 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'baseline',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: '12px',
                    color: 'var(--sepia)',
                    letterSpacing: '0.05em',
                  }}
                >
                  가격
                </span>
                <span
                  style={{
                    fontFamily: "'Noto Serif KR', serif",
                    fontWeight: 700,
                    fontSize: '22px',
                    color: 'var(--ink)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
