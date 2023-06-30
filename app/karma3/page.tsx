'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ProfileAPIs } from './ProfileAPIs'
import { RecommendationAPIs } from './RecommendationAPIs'

export default function Home() {
  const [view, setView] = useState('profiles')
  console.log('view; ', view)
  return (
    <div>
      <div>
        <p className="text-3xl text-slate-400 mb-4">Karma3</p>
        <p className="mb-2 font-bold">API type</p>
        <button
          onClick={() => setView('profiles')}>
          <p
          className={`
          mr-2 rounded-lg px-5 py-2 bg-slate-200
           ${view === 'profiles' ? 'text-black' : 'text-gray-400'}
          `}
          >Profile APIs</p>
        </button>
        <button
         onClick={() => setView('recommendations')}>
          <p
             className={`
             rounded-lg px-5 py-2 bg-slate-200
             ${view === 'recommendations' ? 'text-black' : 'text-gray-400 '}
             `}
          >Recommendation APIs</p>
        </button>
      </div>
      {
        view === 'profiles' && <ProfileAPIs />
      }
      {
        view === 'recommendations' && <RecommendationAPIs />
      }
    </div>
  )
}
