export type ThemeId =
  | 'classic'
  | 'blackwhite'
  | 'nightExtra'
  | 'parisian'
  | 'redEdition'
  | 'earlGrey'
  | 'goldPress'
  | 'blueSky'
  | 'greenTea'
  | 'modern'

export interface ThemeConfig {
  id: ThemeId
  name: string
  nameEn: string
  description: string
  vars: {
    paper: string
    ink: string
    sepia: string
    inkLight: string
  }
  fontHeading: string
  fontBody: string
  fontUrl?: string
}

export interface StoreInfo {
  name: string
  slogan: string
  hours: string
  address: string
  instagram: string
  notice: string
  activeTheme: ThemeId
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
