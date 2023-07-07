'use client'
import { useState, useEffect} from 'react'
import { client, refresh, explorePublications, profilesByAddress, challenge, authenticate, feed  } from '../../api'
import { Publication } from '@lens-protocol/widgets-react'
import { Button } from '../components/Button'
import { Loading } from '../components/Loading'
import { ethers } from 'ethers'

declare global {
  interface Window {
    // @ts-ignore
    ethereum: any
  }
}

export default function Home() {
  const [publications, setPublications] = useState<any>([])
  const [sortCriteria, setSortCriteria] = useState('TOP_COMMENTED')
  const [loadingMain, setLoadingMain] = useState(false)
  const [loadingFeed, setLoadingFeed] = useState(false)
  const [view, setView] = useState('global')
  const [authenticated, setAuthenticated] = useState(false)
  const [personalizedFeed, setPersonalizedFeed] = useState<any>([])
  useEffect(() => {
    fetchPublications()
    checkTokens()
  }, [sortCriteria])
  async function connect() {
    /* this allows the user to connect their wallet */
    const account = await window.ethereum.send('eth_requestAccounts')
    if (account.result.length) {
      return account.result[0]
    }
  }
  async function checkTokens() {
    try {
      const refreshToken = window.localStorage.getItem('lens-algo-rt')
      if (refreshToken) {
        setAuthenticated(true)
        const response = await client.mutate({
          mutation: refresh,
          variables: {
            token: refreshToken
          }
        })
        const { accessToken, refreshToken: newRefreshToken } = response.data.refresh
        window.localStorage.setItem('lens-algo-rt', newRefreshToken)
        fetchFeed(accessToken)
      }
    } catch (err) {
      console.log('error:', err)
    }
  }
  async function fetchPublications() {
    try {
      setLoadingMain(true)
      setPublications([])
      const response = await client.query({
        query: explorePublications,
        variables: {
          sortCriteria,
        },
      })
      setPublications(response.data.explorePublications.items)
      setLoadingMain(false)
    } catch (err) {
      console.log('error:', err)
      setLoadingMain(false)
    }
  }

  async function fetchFeed(accessToken) {
    setLoadingFeed(true)
    try {
      const account = await window.ethereum.send('eth_requestAccounts')
      const address = account.result[0]
      const profileResponse = await client.query({
        query: profilesByAddress,
        variables: {
          address
        }
      })

      const profileId = profileResponse.data.profiles.items[0].id

      const response = await client.query({
        query: feed,
        variables: {
          profileId
        },
        context: {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      })
      const items = response.data.feed.items.map(i => i.root)      
      setPersonalizedFeed(items)
      setLoadingFeed(false)
      console.log('items:', items)
    } catch (err) {
      setLoadingFeed(false)
      console.log('error fetching feed...', err)
    }
  }

  async function signIn() {
    let currentAddress = await connect()
    try {
      /* first request the challenge from the API server */
      const challengeInfo = await client.query({
        query: challenge,
        variables: { address: currentAddress }
      })
      const provider =  new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner()
      /* ask the user to sign a message with the challenge info returned from the server */
      const signature = await signer.signMessage(challengeInfo.data.challenge.text)
      /* authenticate the user */
      const authData = await client.mutate({
        mutation: authenticate,
        variables: {
          address: currentAddress, signature
        }
      })
      /* if user authentication is successful, you will receive an accessToken and refreshToken */
      const { data: { authenticate: { accessToken, refreshToken }}} = authData
      fetchFeed(accessToken)
      setAuthenticated(true)
      window.localStorage.setItem('lens-algo-rt', refreshToken)
    } catch (err) {
      console.log('Error signing in: ', err)
    }
  }

  return (
    <div>
      <div>
        <p className="text-3xl text-slate-400 mb-4">Lens</p>
        <p className="mb-2 font-bold">API type</p>
        <button
          onClick={() => setView('global')}>
          <p
          className={`
          mr-2 rounded-lg px-5 py-2 bg-slate-200
           ${view === 'global' ? 'text-black' : 'text-gray-400'}
          `}
          >Global</p>
        </button>
        <button
         onClick={() => setView('personalized')}>
          <p
             className={`
             rounded-lg px-5 py-2 bg-slate-200
             ${view === 'personalized' ? 'text-black' : 'text-gray-400 '}
             `}
          >Personalized</p>
        </button>
      </div>
      {
        view === 'global' && (
          <>
            <p className="font-bold mt-4">Global APIs</p>
            <div>
              <p className="text-sm mt-3 mb-2 text-slate-400">Sort Criteria</p>
              <div>
                <Button
                  disabled={sortCriteria === 'TOP_COMMENTED'}
                  text="Top Commented"
                  onClick={() => setSortCriteria('TOP_COMMENTED')}
                  className={`
                  ${sortCriteria === 'TOP_COMMENTED' ? 'bg-purple-500' : 'bg-purple-400'}
                  `}
                />
                <Button
                  disabled={sortCriteria === 'TOP_COLLECTED'}
                  text="Top Collected"
                  onClick={() => setSortCriteria('TOP_COLLECTED')}
                  className={`
                  ${sortCriteria === 'TOP_COLLECTED' ? 'bg-purple-500' : 'bg-purple-400'}
                  `}
                />
                <Button
                  disabled={sortCriteria === 'TOP_MIRRORED'}
                  text="Top Mirrored"
                  onClick={() => setSortCriteria('TOP_MIRRORED')}
                  className={`
                  ${sortCriteria === 'TOP_MIRRORED' ? 'bg-purple-500' : 'bg-purple-400'}
                  `}
                />
                <Button
                  disabled={sortCriteria === 'CURATED_PROFILES'}
                  text="Curated Profiles"
                  onClick={() => setSortCriteria('CURATED_PROFILES')}
                  className={`
                  ${sortCriteria === 'CURATED_PROFILES' ? 'bg-purple-500' : 'bg-purple-400'}
                  `}
                />
                <Button
                  disabled={sortCriteria === 'LATEST'}
                  text="Latest"
                  onClick={() => setSortCriteria('LATEST')}
                  className={`
                  ${sortCriteria === 'LATEST' ? 'bg-purple-500' : 'bg-purple-400'}
                  `}
                />
              </div>
            </div>
            {
              Boolean(publications.length) && (
                <div className="mt-6">
                  {
                    publications.map(publication => (
                      <div key={publication.id} className="mb-2">
                        <Publication
                          publicationId={publication.id}
                        />
                      </div>
                    ))
                  }
                </div>
              )
            }
          </>
        )
      }
      {
       view === 'global' && loadingMain && <Loading className="mt-4" />
      }
      {
       view === 'personalized' && loadingFeed && <Loading className="mt-4" />
      }
      {
        view === 'personalized' && !authenticated && (
          <>
            <p className="mt-4">To use this API, please sign in with Lens.</p>
            <button
              className="
                rounded-full bg-black text-white px-8 py-2 mt-3
              "
              onClick={signIn}
            >Sign in with Lens</button>
          </>
        )
      }
      {
        view === 'personalized' && authenticated && (
          <div>
            <p className="font-bold mt-4">Personalized feed</p>
            <div className="mt-4">
              {
                personalizedFeed.map(publication => (
                  <div key={publication.id} className="mb-2 [&>div>div>div>div]:pb-2">
                    <Publication
                      publicationId={publication.id}
                    />
                  </div>
                ))
              }
            </div>
          </div>
        )
      }
    </div>
  )
}
