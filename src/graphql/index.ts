import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL + '/graphql' || 'http://localhost:8080/api/graphql',
  cache: new InMemoryCache(),
  link: from([
    errorLink,
    createUploadLink({
      uri: process.env.NEXT_PUBLIC_API_URL + '/graphql' || 'http://localhost:8080/api/graphql',
      headers: {
        'Apollo-Require-Preflight': 'true',
      },
    }),
  ]),
})

export default client
