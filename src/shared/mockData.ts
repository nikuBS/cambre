import type { StoreInfo, Category, MenuItem } from './types'

export const initialStoreInfo: StoreInfo = {
  name: '깜브레 BAR',
  slogan: '오래된 골목, 새로운 밤 — Since 1972',
  hours: '매일 18:00 – 02:00 (일요일 휴무)',
  address: '서울 마포구 어울마당로 130 지하 1층',
  instagram: '@cambre_bar',
  notice: '🍸 이달의 추천 칵테일: 서울의 밤 — 국산 소주베이스 스페셜 칵테일 | 단체예약 문의: 010-1234-5678 | 주차 불가 (대중교통 이용 부탁드립니다)',
}

export const initialCategories: Category[] = [
  { id: 'cat-1', name: '시그니처', nameEn: 'SIGNATURE', icon: 'cocktail', order: 1, isVisible: true },
  { id: 'cat-2', name: '클래식', nameEn: 'CLASSICS', icon: 'classic', order: 2, isVisible: true },
  { id: 'cat-3', name: '논알코올', nameEn: 'ZERO PROOF', icon: 'nonalcohol', order: 3, isVisible: true },
  { id: 'cat-4', name: '푸드', nameEn: 'FOOD', icon: 'food', order: 4, isVisible: true },
]

export const initialMenuItems: MenuItem[] = [
  // 시그니처
  {
    id: 'menu-1', categoryId: 'cat-1',
    name: '서울의 밤', nameEn: 'Seoul Night',
    price: 16000,
    description: '한산 소곡주, 국산 매실주, 유자청, 탄산수로 완성한 한국적 감성의 하이볼. 은은한 매실향과 유자의 상큼함이 조화를 이룹니다.',
    badge: 'BEST', isVisible: true,
  },
  {
    id: 'menu-2', categoryId: 'cat-1',
    name: '종로 블루스', nameEn: 'Jongno Blues',
    price: 17000,
    description: '진 베이스에 블루 큐라소, 레몬 주스, 토닉워터. 푸른 밤하늘빛을 담은 청량한 칵테일.',
    badge: 'NEW', isVisible: true,
  },
  {
    id: 'menu-3', categoryId: 'cat-1',
    name: '마포 스모키', nameEn: 'Mapo Smoky',
    price: 18000,
    description: '메스칼, 아구아디엔테, 라임주스, 아가베 시럽. 스모키함과 시트러스의 절묘한 밸런스.',
    badge: undefined, isVisible: true,
  },
  {
    id: 'menu-4', categoryId: 'cat-1',
    name: '인사동 로즈', nameEn: 'Insadong Rose',
    price: 15000,
    description: '장미 인퓨징 보드카, 리치 시럽, 레몬주스, 소다. 플로럴하고 달콤한 봄날의 한 잔.',
    badge: undefined, isVisible: true,
  },
  {
    id: 'menu-5', categoryId: 'cat-1',
    name: '한강 선셋', nameEn: 'Han River Sunset',
    price: 16000,
    description: '테킬라, 그레나딘, 오렌지 주스, 레드 와인 플로트. 석양처럼 아름다운 층층이 쌓인 색감.',
    badge: 'SOLD_OUT', isVisible: true,
  },
  {
    id: 'menu-6', categoryId: 'cat-1',
    name: '이태원 열대야', nameEn: 'Itaewon Tropical',
    price: 15000,
    description: '럼, 코코넛 크림, 파인애플 주스, 민트. 이국적인 밤을 떠올리게 하는 트로피칼 칵테일.',
    badge: undefined, isVisible: true,
  },
  // 클래식
  {
    id: 'menu-7', categoryId: 'cat-2',
    name: '올드 패션드', nameEn: 'Old Fashioned',
    price: 17000,
    description: '버번 위스키, 앙고스투라 비터스, 설탕, 오렌지 필. 가장 오래된 칵테일 레시피 중 하나.',
    badge: 'BEST', isVisible: true,
  },
  {
    id: 'menu-8', categoryId: 'cat-2',
    name: '네그로니', nameEn: 'Negroni',
    price: 16000,
    description: '진, 스위트 베르무트, 캄파리. 쓴맛과 단맛의 완벽한 균형.',
    badge: undefined, isVisible: true,
  },
  {
    id: 'menu-9', categoryId: 'cat-2',
    name: '마티니', nameEn: 'Martini',
    price: 17000,
    description: '드라이 진, 드라이 베르무트, 올리브. 칵테일의 왕이라 불리는 클래식.',
    badge: undefined, isVisible: true,
  },
  {
    id: 'menu-10', categoryId: 'cat-2',
    name: '다이키리', nameEn: 'Daiquiri',
    price: 15000,
    description: '화이트 럼, 라임 주스, 설탕 시럽. 쿠바에서 온 심플하고 완벽한 칵테일.',
    badge: undefined, isVisible: true,
  },
  {
    id: 'menu-11', categoryId: 'cat-2',
    name: '위스키 사워', nameEn: 'Whiskey Sour',
    price: 16000,
    description: '버번 위스키, 레몬 주스, 설탕 시럽, 에그화이트. 부드러운 거품과 신맛의 조화.',
    badge: undefined, isVisible: true,
  },
  // 논알코올
  {
    id: 'menu-12', categoryId: 'cat-3',
    name: '버진 모히토', nameEn: 'Virgin Mojito',
    price: 9000,
    description: '민트, 라임, 설탕 시럽, 소다워터. 알코올 없이 즐기는 청량한 여름 음료.',
    badge: 'BEST', isVisible: true,
  },
  {
    id: 'menu-13', categoryId: 'cat-3',
    name: '유자 에이드', nameEn: 'Yuzu Ade',
    price: 8000,
    description: '국산 유자청, 레몬즙, 꿀, 탄산수. 상큼하고 건강한 한국식 에이드.',
    badge: 'NEW', isVisible: true,
  },
  {
    id: 'menu-14', categoryId: 'cat-3',
    name: '스파이시 진저', nameEn: 'Spicy Ginger',
    price: 8500,
    description: '생강 시럽, 레몬, 타바스코, 소다. 매콤하고 알싸한 어른의 음료.',
    badge: undefined, isVisible: true,
  },
  {
    id: 'menu-15', categoryId: 'cat-3',
    name: '블루 라군 목테일', nameEn: 'Blue Lagoon Mocktail',
    price: 9000,
    description: '블루 큐라소 시럽, 레모네이드, 소다. 눈부신 푸른빛의 비알코올 칵테일.',
    badge: undefined, isVisible: true,
  },
  // 푸드
  {
    id: 'menu-16', categoryId: 'cat-4',
    name: '치즈 플래터', nameEn: 'Cheese Platter',
    price: 22000,
    description: '3종 치즈(카망베르, 체다, 블루치즈)와 견과류, 크래커, 꿀. 와인과 칵테일에 최적의 안주.',
    badge: 'BEST', isVisible: true,
  },
  {
    id: 'menu-17', categoryId: 'cat-4',
    name: '올리브 믹스', nameEn: 'Mixed Olives',
    price: 10000,
    description: '이탈리안 허브 마리네이드 올리브 모듬. 가볍게 즐기는 바의 기본 안주.',
    badge: undefined, isVisible: true,
  },
  {
    id: 'menu-18', categoryId: 'cat-4',
    name: '감자튀김', nameEn: 'French Fries',
    price: 8000,
    description: '바삭하게 튀긴 감자튀김, 아이올리 소스 제공. 언제나 옳은 선택.',
    badge: undefined, isVisible: true,
  },
  {
    id: 'menu-19', categoryId: 'cat-4',
    name: '살사 나초', nameEn: 'Salsa Nachos',
    price: 12000,
    description: '바삭한 나초칩에 홈메이드 살사, 과카몰레, 사워크림. 멕시칸 감성의 쉐어링 안주.',
    badge: 'NEW', isVisible: true,
  },
  {
    id: 'menu-20', categoryId: 'cat-4',
    name: '스테이크 타코', nameEn: 'Steak Taco',
    price: 18000,
    description: '부드러운 부채살 스테이크, 아보카도 크림, 피코 데 가요. 든든하게 즐기는 메인 푸드.',
    badge: undefined, isVisible: true,
  } as MenuItem,
]
