'use client'
import { useState, useEffect} from 'react'
import Image from 'next/image'
import { client, explorePublications } from '../../api'
import { Publication } from '@lens-protocol/widgets-react'
import { Button } from '../components/Button'
import { Loading } from '../components/Loading'

export default function Home() {
  const [publications, setPublications] = useState<any>([])
  const [sortCriteria, setSortCriteria] = useState('TOP_COMMENTED')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetchPublications()
  }, [sortCriteria])
  async function fetchPublications() {
    try {
      setLoading(true)
      setPublications([])
      const response = await client.query({
        query: explorePublications,
        variables: {
          sortCriteria
        }
      })
      setPublications(response.data.explorePublications.items)
      setLoading(false)
    } catch (err) {
      console.log('error:', err)
      setLoading(false)
    }
  }
  console.log('publications:', publications)
  return (
    <div>
      <div>
        <p className="text-3xl text-slate-400 mb-4">Lens</p>
      </div>
      <p className="font-bold mt-4">Recommendation APIs</p>
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
        <div className="mt-6">
          {
            loading && <Loading />
          }
          {
            publications.map(publication => (
              <div key={publication.id} className="mb-2 [&>div>div>div>div]:pb-2">
                <Publication
                  publicationId={publication.id}
                />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
