export interface StoreInfo {
  name: string
  slogan: string
  hours: string
  address: string
  instagram: string
  notice: string
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  nameEn: string
  price: number
  description: string
  badge?: 'NEW' | 'BEST' | 'SOLD_OUT'
  isVisible: boolean
}

export interface Category {
  id: string
  name: string
  nameEn: string
  icon: 'cocktail' | 'classic' | 'nonalcohol' | 'food'
  order: number
  isVisible: boolean
}
