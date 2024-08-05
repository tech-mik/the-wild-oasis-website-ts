export interface Cabin {
  id?: number
  createdAt?: string
  name?: string
  maxCapacity?: number
  regularPrice?: number
  discount?: number
  description?: string
  image?: string
  imageThumbnail?: string
}

export type TCabinsFilter = 'all' | 'medium' | 'large' | 'small'
