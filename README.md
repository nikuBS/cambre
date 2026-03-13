# Cambre Bar — 칵테일바 메뉴판 서비스

1960~70년대 한국 신문 스타일의 레트로 칵테일바 메뉴판 + 어드민 대시보드

## 기술 스택

- **Vite + React 19 + TypeScript**
- **React Router v6** — `/` 고객 메뉴판, `/admin` 어드민
- **Tailwind CSS + CSS Modules** 혼용
- **Zustand** (localStorage persist) — 메뉴 데이터 상태관리
- **@dnd-kit** — 드래그앤드롭 순서 변경

## 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev
```

- 고객 메뉴판: http://localhost:5173/
- 어드민: http://localhost:5173/admin

## 빌드

```bash
npm run build
# dist/ 폴더에 정적 파일 생성
```

## Vercel 배포

1. [vercel.com](https://vercel.com)에서 GitHub 레포 연결
2. Framework Preset: **Vite** 선택
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy — 자동으로 배포됨

또는 Vercel CLI:

```bash
npm i -g vercel
vercel --prod
```

## 폴더 구조

```
src/
├── shared/
│   ├── types.ts        # 공유 타입 (StoreInfo, MenuItem, Category)
│   ├── mockData.ts     # 초기 목데이터
│   └── store.ts        # Zustand store (CRUD + localStorage persist)
├── client/
│   ├── ClientPage.tsx  # 고객 메뉴판 메인
│   └── components/
│       ├── NewspaperHeader.tsx   # 신문 제호 스타일 헤더
│       ├── CategoryNav.tsx       # sticky 카테고리 탭
│       ├── CategorySection.tsx   # 카테고리별 메뉴 섹션
│       ├── MenuItemCard.tsx      # 메뉴 아이템 카드
│       ├── MenuDetailModal.tsx   # 메뉴 상세 모달
│       ├── NoticeBar.tsx         # 공지사항 marquee
│       └── Footer.tsx            # 푸터
└── admin/
    ├── AdminPage.tsx   # 어드민 메인
    └── components/
        ├── AdminLayout.tsx         # 사이드바 + 상단바 레이아웃
        ├── MenuManagement.tsx      # 메뉴 CRUD + 드래그앤드롭
        ├── CategoryManagement.tsx  # 카테고리 관리
        ├── StoreInfoForm.tsx       # 매장 정보 편집
        └── DataPortability.tsx     # JSON 내보내기/가져오기
```

## 데이터 관리

- 모든 데이터는 **localStorage**에 자동 저장됩니다
- 어드민 → 매장정보 탭 하단에서 JSON 내보내기/가져오기 가능
- 초기화하려면 브라우저 localStorage에서 `cambre-menu-store` 키 삭제
