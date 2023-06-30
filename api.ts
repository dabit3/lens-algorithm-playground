import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const API_URL = 'https://api.lens.dev'

export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache()
})

export const getSocials = gql`
query GetSocials($address: [Identity!]) {
  Socials(
    input: {filter: {identity: {_in: $address}}, blockchain: ethereum}
  ) {
    Social {
      profileName
      dappName
    }
  }
  Domains(input: {filter: {owner: {_in: $address}}, blockchain: ethereum}) {
    Domain {
      dappName
      name
    }
  }
}
`

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

export const profilesByAddress = gql`
  query profiles($address: EthereumAddress!) {
    profiles(request: {
      ownedBy: [$address]
    }) {
      items {
        id
      }
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

export const refresh = gql`
mutation Refresh($token: Jwt!) {
  refresh(request: {
    refreshToken: $token
  }) {
    accessToken
    refreshToken
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

export const feed = gql`
query Feed($profileId: ProfileId!) {
  feed(request: {
    profileId: $profileId,
    limit: 50
  }) {
    items {
      root {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
      }
      electedMirror {
        mirrorId
        profile {
          id
          handle
        }
        timestamp
      }
      mirrors {
        profile {
          id
          handle
        }
        timestamp
      }
      collects {
        profile {
          id
          handle
        }
        timestamp
      }
      reactions {
        profile {
          id
          handle
        }
        reaction
        timestamp
      }
      comments {
        ...CommentFields
      }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}

fragment MediaFields on Media {

  url

  mimeType

}

fragment ProfileFields on Profile {

  id

  name

  bio

  attributes {

    displayType

    traitType

    key

    value

  }

  isFollowedByMe

  isFollowing(who: null)

  followNftAddress

  metadata

  isDefault

  handle

  picture {

    ... on NftImage {

      contractAddress

      tokenId

      uri

      verified

    }

    ... on MediaSet {

      original {

        ...MediaFields

      }

    }

  }

  coverPicture {

    ... on NftImage {

      contractAddress

      tokenId

      uri

      verified

    }

    ... on MediaSet {

      original {

        ...MediaFields

      }

    }

  }

  ownedBy

  dispatcher {

    address

  }

  stats {

    totalFollowers

    totalFollowing

    totalPosts

    totalComments

    totalMirrors

    totalPublications

    totalCollects

  }

  followModule {

    ...FollowModuleFields

  }

}

fragment PublicationStatsFields on PublicationStats { 

  totalAmountOfMirrors

  totalAmountOfCollects

  totalAmountOfComments

}

fragment MetadataOutputFields on MetadataOutput {

  name

  description

  content

  media {

    original {

      ...MediaFields

    }

  }

  attributes {

    displayType

    traitType

    value

  }

}

fragment Erc20Fields on Erc20 {

  name

  symbol

  decimals

  address

}

fragment PostFields on Post {

  id

  profile {

    ...ProfileFields

  }

  stats {

    ...PublicationStatsFields

  }

  metadata {

    ...MetadataOutputFields

  }

  createdAt

  collectModule {

    ...CollectModuleFields

  }

  referenceModule {

    ...ReferenceModuleFields

  }

  appId

  collectedBy {

    ...WalletFields

  }

  hidden

  reaction(request: null)

  mirrors(by: null)

  hasCollectedByMe

}

fragment MirrorBaseFields on Mirror {

  id

  profile {

    ...ProfileFields

  }

  stats {

    ...PublicationStatsFields

  }

  metadata {

    ...MetadataOutputFields

  }

  createdAt

  collectModule {

    ...CollectModuleFields

  }

  referenceModule {

    ...ReferenceModuleFields

  }

  appId

  hidden

  reaction(request: null)

  hasCollectedByMe

}

fragment CommentBaseFields on Comment {

  id

  profile {

    ...ProfileFields

  }

  stats {

    ...PublicationStatsFields

  }

  metadata {

    ...MetadataOutputFields

  }

  createdAt

  collectModule {

    ...CollectModuleFields

  }

  referenceModule {

    ...ReferenceModuleFields

  }

  appId

  collectedBy {

    ...WalletFields

  }

  hidden

  reaction(request: null)

  mirrors(by: null)

  hasCollectedByMe

}

fragment CommentFields on Comment {

  ...CommentBaseFields

  mainPost {

    ... on Post {

      ...PostFields

    }

    ... on Mirror {

      ...MirrorBaseFields

      mirrorOf {

        ... on Post {

           ...PostFields          

        }

        ... on Comment {

           ...CommentMirrorOfFields        

        }

      }

    }

  }

}

fragment CommentMirrorOfFields on Comment {

  ...CommentBaseFields

  mainPost {

    ... on Post {

      ...PostFields

    }

    ... on Mirror {

       ...MirrorBaseFields

    }

  }

}

fragment WalletFields on Wallet {

   address,

   defaultProfile {

    ...ProfileFields

   }

}

fragment FollowModuleFields on FollowModule {

  ... on FeeFollowModuleSettings {

    type

    amount {

      asset {

        name

        symbol

        decimals

        address

      }

      value

    }

    recipient

  }

  ... on ProfileFollowModuleSettings {

    type

    contractAddress

  }

  ... on RevertFollowModuleSettings {

    type

    contractAddress

  }

  ... on UnknownFollowModuleSettings {

    type

    contractAddress

    followModuleReturnData

  }

}

fragment CollectModuleFields on CollectModule {

  __typename

  ... on FreeCollectModuleSettings {

    type

    followerOnly

    contractAddress

  }

  ... on FeeCollectModuleSettings {

    type

    amount {

      asset {

        ...Erc20Fields

      }

      value

    }

    recipient

    referralFee

  }

  ... on LimitedFeeCollectModuleSettings {

    type

    collectLimit

    amount {

      asset {

        ...Erc20Fields

      }

      value

    }

    recipient

    referralFee

  }

  ... on LimitedTimedFeeCollectModuleSettings {

    type

    collectLimit

    amount {

      asset {

        ...Erc20Fields

      }

      value

    }

    recipient

    referralFee

    endTimestamp

  }

  ... on RevertCollectModuleSettings {

    type

  }

  ... on TimedFeeCollectModuleSettings {

    type

    amount {

      asset {

        ...Erc20Fields

      }

      value

    }

    recipient

    referralFee

    endTimestamp

  }

  ... on UnknownCollectModuleSettings {

    type

    contractAddress

    collectModuleReturnData

  }

}

fragment ReferenceModuleFields on ReferenceModule {

  ... on FollowOnlyReferenceModuleSettings {

    type

    contractAddress

  }

  ... on UnknownReferenceModuleSettings {

    type

    contractAddress

    referenceModuleReturnData

  }

  ... on DegreesOfSeparationReferenceModuleSettings {

    type

    contractAddress

    commentsRestricted

    mirrorsRestricted

    degreesOfSeparation

  }

}
`