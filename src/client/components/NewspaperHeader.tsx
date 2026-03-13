import React from 'react'
import type { StoreInfo } from '../../shared/types'

interface NewspaperHeaderProps {
  storeInfo: StoreInfo
}

function getEditionNumber(date: Date): number {
  // 1972년 1월 1일 창간으로부터 몇 호인지 계산
  const founded = new Date(1972, 0, 1)
  const diffTime = date.getTime() - founded.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}년 ${month}월 ${day}일`
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: 'relative' as const,
    backgroundColor: 'var(--paper)',
    padding: '0',
    margin: '0 0 0 0',
  },
  outerBorder: {
    border: '3px double var(--ink)',
    margin: '12px',
    padding: '0',
  },
  innerBorder: {
    border: '1px solid var(--ink)',
    margin: '3px',
    padding: '12px 16px 14px',
    filter: 'url(#paper-grain)',
  },
  metaBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--ink)',
    paddingBottom: '6px',
    marginBottom: '8px',
    fontSize: '11px',
    fontFamily: "'Noto Sans KR', sans-serif",
    color: 'var(--ink-light)',
    letterSpacing: '0.04em',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  titleArea: {
    textAlign: 'center' as const,
    padding: '8px 0',
  },
  mainTitle: {
    fontFamily: "'Noto Serif KR', serif",
    fontWeight: 900,
    fontSize: 'clamp(36px, 8vw, 72px)',
    color: 'var(--ink)',
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    display: 'block',
  },
  slogan: {
    fontFamily: "'Noto Serif KR', serif",
    fontWeight: 400,
    fontSize: '13px',
    color: 'var(--sepia)',
    marginTop: '4px',
    letterSpacing: '0.1em',
    fontStyle: 'italic' as const,
    display: 'block',
  },
  subInfo: {
    borderTop: '1px solid var(--ink)',
    marginTop: '8px',
    paddingTop: '6px',
    textAlign: 'center' as const,
    fontSize: '11px',
    fontFamily: "'Noto Sans KR', sans-serif",
    color: 'var(--ink-light)',
    letterSpacing: '0.05em',
  },
}

export default function NewspaperHeader({ storeInfo }: NewspaperHeaderProps) {
  const today = new Date()
  const dateStr = formatDate(today)
  const edition = getEditionNumber(today)

  return (
    <header style={styles.wrapper}>
      {/* SVG paper grain filter 정의 */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="paper-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
            <feComposite in="blended" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <div style={styles.outerBorder}>
        <div style={styles.innerBorder}>
          {/* 메타바 */}
          <div style={styles.metaBar}>
            <span style={styles.metaItem}>
              <span>{dateStr}</span>
            </span>
            <span style={styles.metaItem}>
              <span>창간 제{edition.toLocaleString()}호</span>
            </span>
            <span style={styles.metaItem}>
              <span>☁️ 오늘의 날씨</span>
            </span>
          </div>

          {/* 제호 */}
          <div style={styles.titleArea}>
            <span style={styles.mainTitle}>{storeInfo.name}</span>
            <span style={styles.slogan}>{storeInfo.slogan}</span>
          </div>

          {/* 영업시간 · 주소 */}
          <div style={styles.subInfo}>
            {storeInfo.hours}&nbsp;·&nbsp;{storeInfo.address}
          </div>
        </div>
      </div>
    </header>
  )
}
