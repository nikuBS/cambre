import { useEffect, useRef, useState, useCallback } from 'react'
import { useMenuStore } from '../shared/store'
import NewspaperHeader from './components/NewspaperHeader'
import NoticeBar from './components/NoticeBar'
import CategoryNav from './components/CategoryNav'
import CategorySection from './components/CategorySection'
import Footer from './components/Footer'

export default function ClientPage() {
  const { storeInfo, categories, menuItems } = useMenuStore()

  // isVisible: true인 카테고리만, order 순 정렬
  const visibleCategories = [...categories]
    .filter((c) => c.isVisible)
    .sort((a, b) => a.order - b.order)

  // isVisible: true인 메뉴 아이템만
  const visibleMenuItems = menuItems.filter((m) => m.isVisible)

  // 활성 카테고리 상태
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    visibleCategories[0]?.id ?? ''
  )

  // Intersection Observer: 스크롤 위치에 따라 활성 탭 자동 변경
  const observerRef = useRef<IntersectionObserver | null>(null)
  const categoryIdsKey = visibleCategories.map((c) => c.id).join(',')

  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // 화면에 가장 많이 보이는 섹션을 활성으로
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0) {
          const id = visible[0].target.id.replace('category-section-', '')
          setActiveCategoryId(id)
        }
      },
      {
        rootMargin: '-60px 0px -40% 0px',
        threshold: [0, 0.3, 0.5, 0.8, 1.0],
      }
    )

    categoryIdsKey.split(',').filter(Boolean).forEach((catId) => {
      const el = document.getElementById(`category-section-${catId}`)
      if (el) observerRef.current!.observe(el)
    })
  }, [categoryIdsKey])

  useEffect(() => {
    // DOM이 그려진 다음 프레임에 옵저버 설정
    const frame = requestAnimationFrame(() => {
      setupObserver()
    })
    return () => {
      cancelAnimationFrame(frame)
      observerRef.current?.disconnect()
    }
  }, [setupObserver])

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategoryId(categoryId)
  }

  return (
    <>
      <style>{`
        /* print 스타일 */
        @media print {
          body { background: var(--paper) !important; }
          .client-page { max-width: 100% !important; }
          .category-nav,
          .notice-bar,
          .menu-detail-modal { display: none !important; }
        }
      `}</style>

      <div
        className="client-page"
        style={{
          backgroundColor: 'var(--paper)',
          maxWidth: '1024px',
          margin: '0 auto',
          minHeight: '100vh',
          position: 'relative' as const,
        }}
      >
        {/* 신문 헤더 */}
        <NewspaperHeader storeInfo={storeInfo} />

        {/* 속보 공지 */}
        <NoticeBar notice={storeInfo.notice} />

        {/* 카테고리 네비게이션 (sticky) */}
        {visibleCategories.length > 0 && (
          <CategoryNav
            categories={visibleCategories}
            activeCategoryId={activeCategoryId}
            onCategoryClick={handleCategoryClick}
          />
        )}

        {/* 카테고리별 섹션 */}
        <main style={{ paddingTop: '8px' }}>
          {visibleCategories.map((cat) => {
            const items = visibleMenuItems.filter((m) => m.categoryId === cat.id)
            return (
              <CategorySection
                key={cat.id}
                category={cat}
                menuItems={items}
              />
            )
          })}

          {visibleCategories.length === 0 && (
            <div
              style={{
                textAlign: 'center' as const,
                padding: '60px 24px',
                fontFamily: "'Noto Serif KR', serif",
                fontSize: '16px',
                color: 'var(--sepia)',
              }}
            >
              준비 중입니다.
            </div>
          )}
        </main>

        {/* 푸터 */}
        <Footer storeInfo={storeInfo} />
      </div>
    </>
  )
}
