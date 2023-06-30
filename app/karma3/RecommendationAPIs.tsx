'use client'
import { useState, useEffect } from 'react'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Loading } from '../components/Loading'
import { Publication } from '@lens-protocol/widgets-react'

export function RecommendationAPIs() {
  const [strategy, setStrategy] = useState('recent')
  const [feedType, setFeedType] = useState('global')
  let [handle, setHandle] = useState('profileId')
  const [feed, setFeed] = useState<any>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (strategy) {
      console.log('strategy: ', strategy)
      fetchGlobalFeed()
    }
  }, [strategy])
  async function fetchGlobalFeed() {
    try {
      setLoading(true)
      setFeed([])
      const uri = `https://lens-api.k3l.io/feed/${strategy}?limit=20`
      const response = await fetch(uri)
      const json = await response.json()
      setFeed(json)
      setLoading(false)
    } catch (err) {
      console.log('error: ', err)
      setLoading(false)
    }
  }
  async function fetchPersonalizedFeed() {
    try {
      setLoading(true)
      setFeed([])
      if (!handle.includes('.lens')) {
        handle = handle + '.lens'
      }
      const uri = `https://lens-api.k3l.io/feed/personal/${handle}?limit=20`
      const response = await fetch(uri)
      const json = await response.json()
      setFeed(json)
      setLoading(false)
    } catch (err) {
      console.log('error: ', err)
      setLoading(false)
    }
  }
  return (
    <div>
      <p className="font-bold mt-4">Recommendation APIs</p>
      <div>
        <p className="text-sm mt-3 mb-2 text-slate-400">Strategies</p>
        <div>
          <Button
            disabled={feedType === 'personalized'}
            text="Recent"
            onClick={() => setStrategy('recent')}
            className={`
            ${strategy === 'recent' ? 'bg-purple-500' : 'bg-purple-400'}
            `}
          />
          <Button
            disabled={feedType === 'personalized'}
            text="Popular"
            onClick={() => setStrategy('popular')}
            className={`
            ${strategy === 'popular' ? 'bg-purple-500' : 'bg-purple-400'}
            `}
          />
          <Button
            disabled={feedType === 'personalized'}
            text="Recommended"
            onClick={() => setStrategy('recommended')}
            className={`
            ${strategy === 'recommended' ? 'bg-purple-500' : 'bg-purple-400'}
            `}
          />
          <Button
            disabled={feedType === 'personalized'}
            text="Crowdsourced"
            onClick={() => setStrategy('crowdsourced')}
            className={`
            ${strategy === 'crowdsourced' ? 'bg-purple-500' : 'bg-purple-400'}
            `}
          />
        </div>
      </div>
      <div>
        <p className="text-sm mt-3 text-slate-400">APIs</p>
        <div className="mt-2">
          <button
            onClick={() => {
              setStrategy('recent')
              setFeedType('global')
            }}
          >
            <p className={`
            mr-2 text-sm text-white px-4 py-1 rounded-full
            ${feedType === 'global' ? 'bg-blue-500' : 'bg-blue-400'}
            `}>Global</p>
          </button>
          <button
            onClick={() => {
              setFeedType('personalized')
              setFeed([])
              setStrategy('')
            }}
          >
            <p className={`
            text-sm text-white px-4 py-1 rounded-full
            ${feedType === 'personalized' ? 'bg-blue-500' : 'bg-blue-400'}
            `}>Personalized</p>
          </button>
        </div>
        {
          feedType === 'global' ? (
            <p className="mt-3">The 
              <span className="text-slate-400">
              <a target="_blank" rel="no-opener" href="https://openapi.lens.k3l.io/#/default/getFeed"> /feed </a></span>
              endpoint retrieves general purpose global content feed, using several strategies.
            </p>
          ) : (
          <p className="mt-3">The 
            <span className="text-slate-400">
            <a target="_blank" rel="no-opener" href="https://openapi.lens.k3l.io/#/default/getDefaultPersonalFeed"> /feed/personal </a></span>
            endpoint retrieves a lists of posts that are most relevant to each user.
          </p>
        )
        }
      </div>
      <div className="mt-3 p-2">
        {
          feedType === 'personalized' && (
            <div className="flex flex-col items-start">
              <Input
                onChange={e => setHandle(e.target.value)}
                placeholder="Lens Handle"
                className='mb-3'
              />
              <Button
                text="Fetch personalized feed"
                onClick={fetchPersonalizedFeed}
                className='bg-green-500 mb-8'
              />
            </div>
          )
        }
        {
          feed.map(item => (
            <div className="mb-2 [&>div>div>div>div]:pb-2" key={item.postId}>
              <Publication
                publicationId={item.postId}
              />
            </div>
          ))
        }
        {
          loading && <Loading />
        }
      </div>
    </div>
  )
}