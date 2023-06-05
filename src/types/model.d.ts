import { Role } from '@/services/auth.service'

export type Type = 'exchange' | 'market' | 'auction' | 'donate' | 'default'
export interface Stuff {
  id: number
  name: string
  description: string
  condition: number
  type: {
    id?: string
    name?: string
    slug?: string
  }
  category: {
    id?: number
    name?: string
    slug?: string
  }
  tags?: StuffTag[]
  price: number
  media?: string[]
  author: UserDetailInResponse
  type_price: StuffTypePrice
  create_at: string
  update_at?: string
}

export type StuffTypePrice = 'point' | 'money'

export interface StuffType {
  id: string
  name: string
  slug: string
}

export interface StuffCategory {
  id: string
  name: string
  slug: string
}

export interface StuffTag {
  id: string
  tag: Tag
  value: any
}

export interface Tag {
  id: number
  name?: string
  values?: TagValue[]
}

export interface TagValue {
  slug?: string
  value?: string
}

export interface User {
  uid: string | null
  full_name: string | null
  email: string | null
  photo_url: string | null
  address?: string | null
  role: Role
}

export interface UserDetailInResponse {
  id: string
  information: {
    avatar_url?: string
    full_name?: string
  }
}

export declare enum Role {
  ADMIN = 0,
  MODERATOR = 1,
  MEMBER = 2,
}

export interface CommentInput {
  id: string
  author_id: string
  stuff_id: string
  content: string
  parent_id?: string
  active: boolean
}

export interface CommentSocketResponse {
  comment: Comment
  temp_id: string
}
export interface Comment {
  id?: string
  author_id: string
  author?: UserDetailInResponse
  stuff_id: string
  content: string
  children?: Comment[]
  create_at?: Date
  update_at?: Date
  active: boolean
}

export interface AuthResponse {
  message: string
  data: {
    uid: string
    email?: string
    full_name?: string
    role: Role
    photo_url?: string
  }
}
