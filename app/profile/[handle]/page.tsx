'use client'

import { useParams } from 'next/navigation'
import { Profile } from '@lens-protocol/widgets-react'

export default function ProfileComponent() {
  const { handle } = useParams()
  return (
    <div>
      <Profile handle={handle} />
    </div>
  )
}