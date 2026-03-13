import type { ThemeId, ThemeConfig } from './types'

export const THEMES: ThemeConfig[] = [
  {
    id: 'classic',
    name: '조선 세피아',
    nameEn: 'Joseon Sepia',
    description: '누렇게 바랜 한지 느낌의 클래식 레트로',
    vars: {
      paper: '#f5e6c8',
      ink: '#1a1a1a',
      sepia: '#8b7355',
      inkLight: '#3d3d3d',
      badgeNew:  '#1a4870', // 딥 네이비
      badgeBest: '#7a2010', // 테라코타
      badgeText: '#f5e6c8',
    },
    fontHeading: "'Noto Serif KR', serif",
    fontBody: "'Noto Sans KR', sans-serif",
  },
  {
    id: 'blackwhite',
    name: '흑백 특보',
    nameEn: 'Black & White',
    description: '순수한 흑백 인쇄 신문 스타일',
    vars: {
      paper: '#f7f7f2',
      ink: '#000000',
      sepia: '#555555',
      inkLight: '#333333',
      badgeNew:  '#111111', // 블랙
      badgeBest: '#555555', // 다크 그레이
      badgeText: '#f7f7f2',
    },
    fontHeading: "'Noto Serif KR', serif",
    fontBody: "'Noto Sans KR', sans-serif",
  },
  {
    id: 'nightExtra',
    name: '야간 호외',
    nameEn: 'Night Extra',
    description: '깊은 밤 인쇄소의 다크 에디션',
    vars: {
      paper: '#0d0d0f',
      ink: '#d4c8a8',
      sepia: '#a08060',
      inkLight: '#b0a890',
      badgeNew:  '#2a7080', // 틸 블루
      badgeBest: '#8a5010', // 앰버 브라운
      badgeText: '#f0ece0',
    },
    fontHeading: "'Noto Serif KR', serif",
    fontBody: "'Noto Sans KR', sans-serif",
  },
  {
    id: 'parisian',
    name: '파리지앵',
    nameEn: 'Parisian',
    description: '프랑스 카페의 감성, 크림빛 바탕에 깊은 남색',
    vars: {
      paper: '#f0e8d8',
      ink: '#1a2456',
      sepia: '#4a5880',
      inkLight: '#2a3870',
      badgeNew:  '#6a1a30', // 버건디
      badgeBest: '#1a5a30', // 포레스트 그린
      badgeText: '#f0e8d8',
    },
    fontHeading: "'Noto Serif KR', serif",
    fontBody: "'Noto Sans KR', sans-serif",
    fontUrl:
      'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700;900&family=Noto+Sans+KR:wght@400;500;700&display=swap',
  },
  {
    id: 'redEdition',
    name: '적색 특보',
    nameEn: 'Red Edition',
    description: '위기의 속보, 강렬한 적색 잉크',
    vars: {
      paper: '#fff5f0',
      ink: '#7a0000',
      sepia: '#a03020',
      inkLight: '#8b2010',
      badgeNew:  '#0a2060', // 딥 네이비
      badgeBest: '#1a5a20', // 포레스트 그린
      badgeText: '#fff5f0',
    },
    fontHeading: "'Noto Serif KR', serif",
    fontBody: "'Noto Sans KR', sans-serif",
  },
  {
    id: 'earlGrey',
    name: '홍차 에디션',
    nameEn: 'Earl Grey',
    description: '따뜻한 홍차색 종이, 깊은 브라운 잉크',
    vars: {
      paper: '#e8d5b7',
      ink: '#3d2b1f',
      sepia: '#7a5a3a',
      inkLight: '#5a3d28',
      badgeNew:  '#1a4a50', // 딥 틸
      badgeBest: '#6a1020', // 와인 레드
      badgeText: '#e8d5b7',
    },
    fontHeading: "'Noto Serif KR', serif",
    fontBody: "'Noto Sans KR', sans-serif",
  },
  {
    id: 'goldPress',
    name: '금장판',
    nameEn: 'Gold Press',
    description: '한밤의 고급 인쇄, 검정 바탕에 금빛 잉크',
    vars: {
      paper: '#120f08',
      ink: '#c9a84c',
      sepia: '#a07830',
      inkLight: '#b09040',
      badgeNew:  '#1a3a70', // 코발트 블루
      badgeBest: '#1a6040', // 에메랄드 그린
      badgeText: '#f0e8c0',
    },
    fontHeading: "'Noto Serif KR', serif",
    fontBody: "'Noto Sans KR', sans-serif",
  },
  {
    id: 'blueSky',
    name: '청운 신문',
    nameEn: 'Blue Sky',
    description: '맑은 하늘빛 종이, 깊은 네이비 잉크',
    vars: {
      paper: '#e8f0f8',
      ink: '#1a2d4a',
      sepia: '#3a5a7a',
      inkLight: '#2a4060',
      badgeNew:  '#1a5a28', // 포레스트 그린
      badgeBest: '#7a1a28', // 버건디
      badgeText: '#e8f0f8',
    },
    fontHeading: "'Noto Serif KR', serif",
    fontBody: "'Noto Sans KR', sans-serif",
  },
  {
    id: 'greenTea',
    name: '녹차 호외',
    nameEn: 'Green Tea',
    description: '은은한 녹차색 종이, 짙은 숲빛 잉크',
    vars: {
      paper: '#e8f0e4',
      ink: '#1a3320',
      sepia: '#3a6040',
      inkLight: '#2a4a30',
      badgeNew:  '#1a2a60', // 딥 네이비
      badgeBest: '#6a1a18', // 다크 레드
      badgeText: '#e8f0e4',
    },
    fontHeading: "'Noto Serif KR', serif",
    fontBody: "'Noto Sans KR', sans-serif",
  },
  {
    id: 'modern',
    name: '모던 신문',
    nameEn: 'Modern',
    description: '군더더기 없는 순백 바탕의 현대적 레이아웃',
    vars: {
      paper: '#ffffff',
      ink: '#111111',
      sepia: '#666666',
      inkLight: '#444444',
      badgeNew:  '#1a3060', // 딥 블루
      badgeBest: '#8a1a1a', // 다크 레드
      badgeText: '#ffffff',
    },
    fontHeading: "'Noto Serif KR', serif",
    fontBody: "'Noto Sans KR', sans-serif",
  },
]

export const THEME_MAP: Record<ThemeId, ThemeConfig> = Object.fromEntries(
  THEMES.map((t) => [t.id, t])
) as Record<ThemeId, ThemeConfig>

export function getTheme(id: ThemeId): ThemeConfig {
  return THEME_MAP[id] ?? THEME_MAP['classic']
}
