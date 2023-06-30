import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const API_URL = 'https://api.lens.dev'

export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache()
})

export const challenge = gql`
  query Challenge($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`

export const authenticate = gql`
  mutation Authenticate(
    $address: EthereumAddress!
    $signature: Signature!
  ) {
    authenticate(request: {
      address: $address,
      signature: $signature
    }) {
      accessToken
      refreshToken
    }
  }
`

export const profileByHandle = gql`
  query profile($handle: Handle) {
    profile(request: {
      handle: $handle
    }) {
      id
    }
  }
`

export const profiles = gql`
query profiles($profileIds: [ProfileId!]) {
  profiles(request: {
    profileIds: $profileIds
  })  {
   items {
     id
     handle
     name
    }
  }
}
`

export const explorePublications = gql`
query ExplorePublications(
  $sortCriteria: PublicationSortCriteria!
) {
  explorePublications(request: {
    sortCriteria: $sortCriteria,
    publicationTypes: [POST, COMMENT, MIRROR],
    limit: 20
  }) {
    items {
      __typename 
      ... on Post {
        id
      }
      
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}
`