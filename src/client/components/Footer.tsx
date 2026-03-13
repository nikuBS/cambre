import React from 'react'
import type { StoreInfo } from '../../shared/types'

interface FooterProps {
  storeInfo: StoreInfo
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: 'var(--paper)',
    margin: '0 12px 20px',
  },
  outerBorder: {
    border: '3px double var(--ink)',
    padding: '0',
  },
  innerBorder: {
    border: '1px solid var(--ink)',
    margin: '3px',
    padding: '20px 20px 24px',
  },
  adHeader: {
    textAlign: 'center' as const,
    borderBottom: '1px solid var(--ink)',
    paddingBottom: '10px',
    marginBottom: '16px',
  },
  adLabel: {
    fontFamily: "'Noto Sans KR', sans-serif",
    fontSize: '10px',
    letterSpacing: '0.2em',
    color: 'var(--sepia)',
    display: 'block',
    marginBottom: '4px',
  },
  adTitle: {
    fontFamily: "'Noto Serif KR', serif",
    fontWeight: 900,
    fontSize: '18px',
    color: 'var(--ink)',
    letterSpacing: '0.08em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px 20px',
  },
  section: {
    borderTop: '1.5px solid var(--ink)',
    paddingTop: '10px',
  },
  sectionLabel: {
    fontFamily: "'Noto Serif KR', serif",
    fontWeight: 700,
    fontSize: '12px',
    color: 'var(--ink)',
    letterSpacing: '0.08em',
    marginBottom: '6px',
    display: 'block',
  },
  sectionValue: {
    fontFamily: "'Noto Sans KR', sans-serif",
    fontSize: '12px',
    color: 'var(--ink-light)',
    lineHeight: 1.65,
    whiteSpace: 'pre-wrap' as const,
  },
  instagramLink: {
    fontFamily: "'Noto Sans KR', sans-serif",
    fontSize: '13px',
    color: 'var(--ink)',
    fontWeight: 700,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  copyright: {
    textAlign: 'center' as const,
    marginTop: '16px',
    paddingTop: '10px',
    borderTop: '1px dashed var(--sepia)',
    fontFamily: "'Noto Sans KR', sans-serif",
    fontSize: '10px',
    color: 'var(--sepia)',
    letterSpacing: '0.06em',
  },
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function Footer({ storeInfo }: FooterProps) {
  return (
    <footer style={styles.footer}>
      <div style={styles.outerBorder}>
        <div style={styles.innerBorder}>
          {/* 광고 스타일 헤더 */}
          <div style={styles.adHeader}>
            <span style={styles.adLabel}>— VINTAGE BAR AD —</span>
            <span style={styles.adTitle}>{storeInfo.name}</span>
          </div>

          {/* 정보 그리드 */}
          <div style={styles.grid}>
            {/* 인스타그램 */}
            <div style={styles.section}>
              <span style={styles.sectionLabel}>SNS</span>
              <a
                href={`https://instagram.com/${storeInfo.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.instagramLink}
              >
                <InstagramIcon />
                {storeInfo.instagram}
              </a>
            </div>

            {/* 예약 */}
            <div style={styles.section}>
              <span style={styles.sectionLabel}>예약 문의</span>
              <span style={styles.sectionValue}>
                전화 또는 인스타그램{'\n'}DM으로 문의 주세요
              </span>
            </div>

            {/* 영업시간 */}
            <div style={styles.section}>
              <span style={styles.sectionLabel}>영업시간</span>
              <span style={styles.sectionValue}>{storeInfo.hours}</span>
            </div>

            {/* 주소 */}
            <div style={styles.section}>
              <span style={styles.sectionLabel}>주소</span>
              <span style={styles.sectionValue}>{storeInfo.address}</span>
            </div>
          </div>

          {/* 카피라이트 */}
          <p style={styles.copyright}>
            ⓒ {new Date().getFullYear()} {storeInfo.name} All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
