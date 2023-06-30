'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [view, setView] = useState('profiles')
  console.log('view; ', view)
  return (
    <div>
      <div>
        <p className="text-3xl text-slate-400 mb-4">Airstack</p>
        <p>Coming soon...</p>
      </div>
    </div>
  )
}
