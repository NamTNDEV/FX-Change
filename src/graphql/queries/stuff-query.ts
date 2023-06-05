import { gql } from '@apollo/client'

// Just for example
const ExampleQuery = gql`
  query hero {
    name
    address
  }
`

export const CreateStuffQuery = gql`
  mutation ($input: StuffInput!) {
    stuff: createStuff(input: $input) {
      id
    }
  }
`

export const GetStuffByID = gql`
  query ($stuffId: ID!) {
    stuff(stuffId: $stuffId) {
      id
      name
      description
      category {
        name
        id
      }
      condition
      custom_field {
        price
      }
      media
      status
      type {
        id
        name
      }
      tags {
        id
        tag_id
        value
      }
    }
  }
`

export const GetTypeList = gql`
  query {
    types {
      id
      name
      slug
    }
  }
`

export const GetCategoryList = gql`
  query {
    categories {
      id
      name
      slug
    }
  }
`

export const GetStuffList = gql`
  query GetStuffListQuery {
    stuff {
      id
      name
    }
  }
`
class StuffQuery {
  getByID() {
    return gql`
      query ($id: ID!) {
        stuff: getStuffById(id: $id) {
          id
          name
          description
          condition
          author {
            id
            information {
              full_name
              avatar_url
            }
          }
          type {
            id
            name
            slug
          }
          category {
            id
            name
            slug
          }
          tags {
            id
            tag {
              name
            }
            value
          }
          create_at
          update_at
        }
      }
    `
  }
  getByTypeSlug() {
    return gql`
      query ($typeSlug: String!) {
        stuff: stuffByTypeSlug(typeSlug: $typeSlug) {
          type {
            id
            name
            slug
          }
          category {
            id
            name
            slug
          }
          author {
            id
            information {
              full_name
              avatar_url
            }
          }
          name
          id
        }
      }
    `
  }
  getAll() {
    return gql`
      query {
        stuff {
          id
          name
          description
          condition
          author {
            id
            information {
              full_name
              avatar_url
            }
          }
          type {
            id
            name
            slug
          }
          category {
            id
            name
            slug
          }
          tags {
            id
            tag {
              name
            }
            value
          }
          media
          create_at
          update_at
        }
      }
    `
  }
  getRecommendStuff() {
    return gql`
      query GetRelatedStuff($id: ID!) {
        getRelateStuff(stuffId: $id) {
          id
          name
          description
          condition
          author {
            id
            information {
              full_name
              avatar_url
            }
          }
          type {
            id
            name
            slug
          }
          category {
            id
            name
            slug
          }
          tags {
            id
            tag {
              name
            }
            value
          }
          create_at
          update_at
        }
      }
    `
  }
}

export default new StuffQuery() as StuffQuery
