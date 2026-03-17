export interface DisplayProduct {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isSale: boolean
  isNew: boolean
  rating: number
  reviewsCount: number
}
export interface DisplayProduct {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isSale: boolean
  isNew: boolean
  rating: number
  reviewsCount: number
}

export interface DisplayCategory {
  id: string
  name: string
  slug: string
  image?: string
  count?: number
}