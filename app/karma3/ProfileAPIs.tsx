'use client'
import { useState, useEffect } from 'react'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Loading } from '../components/Loading'
import { Profile } from '@lens-protocol/widgets-react'

export function ProfileAPIs() {
  const [type, setType] = useState('profile-scores')
  const [score, setScore] = useState<any>()
  let [handle, setHandle] = useState('')
  const [strategy, setStrategy] = useState('followship')
  const [profiles, setProfiles] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentProfile, setCurrentProfile] = useState('')
  const [selectedIndex, setSelectedIndex] = useState<any>()
  if (handle.includes('.lens')) {
    handle = handle.replace(/.lens/g, "")
  }
  useEffect(() => {
    setSelectedIndex(undefined)
    setCurrentProfile('')
    fetchProfileScores()
    if (handle) {
      fetchProfileScore()
    }
  }, [strategy])
  async function fetchProfileScore() {
    if (!handle) return
    setIsLoading(true)
    try {
      const uri = `https://lens-api.k3l.io/profile/score?strategy=${strategy}&handle=${handle}`
      const response = await fetch(uri)
      const json = await response.json()
      console.log('json: ', json)
      const score = Math.round(json.score * 100000) / 100000
      setScore(score)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      console.log('error:', err)
    }
  }
  async function fetchProfileScores() {
    try {
      setIsLoading(true)
      const uri = `https://lens-api.k3l.io/profile/scores?strategy=${strategy}`
      const response = await fetch(uri)
      const json = await response.json()
      console.log('json: ', json)
      setProfiles(json)
      setIsLoading(false)
    } catch (err) {
      console.log('error fetchiing profile scores...: ', err)
    }
  }
  return (
    <div>
      <p className="font-bold mt-4">Profile APIs</p>
      <p className="text-sm mt-3 mb-2 text-slate-400">Strategies</p>
      <Button
        text="Followship"
        onClick={() => setStrategy('followship')}
        className={`
        ${strategy === 'followship' ? 'bg-purple-500' : 'bg-purple-400'}
        `}
      />
      <Button
        text="Engagement"
        onClick={() => setStrategy('engagement')}
        className={`
        ${strategy === 'engagement' ? 'bg-purple-500' : 'bg-purple-400'}
        `}
      />
      <Button
        text="Influencer"
        onClick={() => setStrategy('influencer')}
        className={`
        ${strategy === 'influencer' ? 'bg-purple-500' : 'bg-purple-400'}
        `}
      />
      <Button
        text="Creator"
        onClick={() => setStrategy('creator')}
        className={`
        ${strategy === 'creator' ? 'bg-purple-500' : 'bg-purple-400'}
        `}
      />
      <p className="text-sm mt-3 text-slate-400">APIs</p>
      <div className="mt-2">
        <button
          onClick={() => {
            setType('profile-scores')
            setScore(undefined)
            setHandle('')
          }}
        >
          <p className={`
          mr-2 text-sm text-white px-4 py-1 rounded-full
          ${type === 'profile-scores' ? 'bg-blue-500' : 'bg-blue-400'}
          `}>Profile Scores</p>
        </button>
        <button
          onClick={() => setType('profile-score')}
        >
          <p className={`
          text-sm text-white px-4 py-1 rounded-full
          ${type === 'profile-score' ? 'bg-blue-500' : 'bg-blue-400'}
          `}>Profile Score</p>
        </button>
      </div>
      <div className="mt-4">
        {
          type === 'profile-score' && (
            <div className="flex flex-col items-start">
              <p className="mb-2">The <span className="text-slate-400">/profile/score</span> endpoint retrieves a single profile score.  Each profile score ranges between 0 and 1, with 0 being the lowest score and 1 being the highest score.</p>
              <Input
                placeholder="Lens handle"
                onChange={e => {
                  setHandle(e.target.value);
                  setScore(null)
                }}
                className='mt-1'
              />
              <Button
                onClick={fetchProfileScore}
                text="Fetch Profile Score"
                className="bg-green-500 mt-2"
              />
              {
                score && (
                  <p className="mt-2">
                    Score for {handle}.lens: {score}
                  </p>
                )
              }
            </div>
          )
        }
        <div className="flex">
          {
            type === 'profile-scores' && (
              <div>
                <p>
                The
                <span className="text-slate-400">
                  <a
                  target="_blank" rel="no-opener"
                  href="https://openapi.lens.k3l.io/#/default/getScores">/profile/scores</a></span> endpoint retrieves a list of global <br /> profile scores on the Lens ecosystem</p>
                <div>
                {
                  !isLoading && profiles.map((profile, index) => (
                    <div onClick={() => {
                      setCurrentProfile(profile.handle)
                      setSelectedIndex(index)
                    }} key={profile.handle} className="mt-3 flex items-center cursor-pointer">
                      <p className='text-slate-400 text-sm'>{profile.rank}</p>
                      <p className={`
                      ml-3
                      ${selectedIndex === index && 'text-green-500'}
                      `}>{profile.handle}</p>
                      <p className='ml-3 text-slate-600 text-sm'>Score - {Math.round(profile.score * 100000) / 100000}</p>
                    </div>
                  ))
                }
                </div>
              </div>
            )
          }
          {
            type === 'profile-scores' && currentProfile && (
              <div className="ml-12">
                <Profile handle={currentProfile} />
              </div>
            )
          }
        </div>
      </div>
      {
        isLoading && <Loading className="mt-4" />
      }
    </div>
  )
}