'use client'
import { useState, useEffect } from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { client, profileByHandle, profiles as profilesQuery } from '../../api'
import { Loading } from '../components/Loading'
import { Profile } from '@lens-protocol/widgets-react'
import { ProfileListItem } from '@lens-protocol/widgets-react'

export default function Home() {
  let [handle, setHandle] = useState('')
  const [profiles, setProfiles] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [currentHandle, setCurrentHandle] = useState('')
  const [selectedIndex, setSelectedIndex] = useState<any>()
  useEffect(() => {

  }, [])
  async function fetchData() {
    if (!handle) return
    setLoading(true)
    try {
      if (!handle.includes('.lens')) {
        handle = handle + '.lens'
      }
      const lensApiResponse = await client.query({
        query: profileByHandle,
        variables: {
          handle
        }
      })
      const id = lensApiResponse.data.profile.id
      const response = await fetch('/api/mad-fi', {
        method: "POST",
        body: JSON.stringify({
          id
        })
      })
      const json = await response.json()
      console.log('json: ', json)
      const profileData = await client.query({
        query: profilesQuery,
        variables: {
          profileIds: json.data.allProfiles
        }
      })
      setProfiles(profileData.data.profiles.items)
      setLoading(false)
    } catch (err) {
      console.log('error:', err)
      setLoading(false)
    }
  }
  
  return (
    <div className="flex">
      <div className="flex flex-col items-start">
        <p className="text-3xl text-slate-400 mb-4">MafFi</p>
        <p className="mb-4">
          <span>
            <a target="_blank" rel="no-opener" href="https://docs.madfinance.xyz/api/suggested-follows">Suggested Follows API
            </a>
          </span>
        </p>
        <Input
          placeholder="Lens handle"
          onChange={e => setHandle(e.target.value)}
        />
        <Button
          onClick={fetchData} 
          text="Get suggested follows"
          className='bg-green-500 mt-3'
        />
        <div>
          {
            loading && <Loading className="mt-4" />
          }
          <div className="mt-5">
            {
              profiles.map((profile, index) => (
                <ProfileListItem
                  key={profile.id}
                  profile={profile}
                  onClick={() => {
                    setCurrentHandle(profile.handle)
                    setSelectedIndex(index)
                  }}
                />
               
              ))
            }
          </div>
        </div>
      </div>
      <div className="ml-10">
        {
          currentHandle && <Profile handle={currentHandle} />
        }
      </div>
    </div>
  )
}
