import { Stuff } from './model'

export interface WithClassName {
  className?: string
}

export interface GraphQLResponse<T> {
  data: {
    [key: string]: T
  }
}

export interface StuffListGraphQLResponse {
  stuff: Stuff[]
}
