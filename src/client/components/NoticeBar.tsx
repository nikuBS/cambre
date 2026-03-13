import React from 'react'

interface NoticeBarProps {
  notice: string
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    backgroundColor: 'var(--ink)',
    color: 'var(--paper)',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    padding: '6px 0',
    borderTop: '2px solid var(--ink)',
    borderBottom: '2px solid var(--ink)',
  },
  label: {
    flexShrink: 0,
    backgroundColor: 'var(--paper)',
    color: 'var(--ink)',
    fontFamily: "'Noto Serif KR', serif",
    fontWeight: 700,
    fontSize: '12px',
    padding: '2px 10px',
    marginRight: '12px',
    marginLeft: '12px',
    whiteSpace: 'nowrap' as const,
    letterSpacing: '0.05em',
  },
  marqueeWrapper: {
    overflow: 'hidden',
    flex: 1,
    position: 'relative' as const,
  },
  marqueeTrack: {
    display: 'inline-block',
    whiteSpace: 'nowrap' as const,
    animation: 'marqueeScroll 30s linear infinite',
    fontFamily: "'Noto Sans KR', sans-serif",
    fontSize: '13px',
    letterSpacing: '0.03em',
    color: 'var(--paper)',
  },
}

export default function NoticeBar({ notice }: NoticeBarProps) {
  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        @media print {
          .notice-bar { display: none; }
        }
      `}</style>
      <div style={styles.wrapper} className="notice-bar">
        <span style={styles.label}>【속보】</span>
        <div style={styles.marqueeWrapper}>
          <span style={styles.marqueeTrack}>{notice}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{notice}</span>
        </div>
      </div>
    </>
  )
}
