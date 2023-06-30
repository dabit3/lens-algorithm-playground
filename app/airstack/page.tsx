'use client'
import { useState, useEffect } from 'react'
import { getSocials } from '../../api'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { Loading } from '../components/Loading'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

const URI = 'https://api.airstack.xyz/gql'

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache()
})


export default function Home() {
  const [domains, setDomains] = useState<any>([])
  const [socials, setSocials] = useState<any>([])
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  async function fetchProfiles() {
    if (!address) return
    try {
      setLoading(true)
      setMessage('')
      setDomains([])
      setSocials([])
      const response = await client.query({
        query: getSocials,
        variables: {
          address
        },
        context: {
          headers: {
            authorization: process.env.NEXT_PUBLIC_AIRSTACK_KEY || ''
          }
        }
      })
      console.log('response: ', response)
      const {
        Domains, Socials
      } = response.data
      if (Domains.Domain) {
        setDomains(Domains.Domain)
      }
      if (Socials.Social) {
        setSocials(Socials.Social)
      }
      if (!Socials.Social && !Domains.Domain) {
        setMessage('No profiles for this address.')
      }
      setLoading(false)
    } catch (err) {
      console.log('error fetching profiles ...', err)
      setLoading(false)
    }
  }
  console.log('domains:', domains)
  return (
    <div>
      <div>
        <p className="text-3xl text-slate-400 mb-4">Airstack</p>
        <div className="flex flex-col items-start">
          <Input
            placeholder="Ethereum address"
            onChange={e => {
              setAddress(e.target.value)
            }}
          />
          <Button
            text="Get social profiles"
            onClick={fetchProfiles}
            className="bg-green-500 mt-2 mb-4"
          />
        </div>
        {
          Boolean(domains.length) && (
            <>
              <p className="text-green-500 text-lg">Domains</p>
              {
                domains.map(domain => <p key={domain.name}>{domain.name}</p>)
              }
            </>
          )
        }
        {
          Boolean(socials.length) && (
            <>
              <p className="mt-4 text-blue-500 text-lg">Socials</p>
              {
                socials.map(social => (
                  <div key={social.profileName}>
                    <p>Protocol: {social.dappName}</p>
                    <p>Handle: {social.profileName}</p>
                  </div>
                ))
              }
            </>
          )
        }
        {
          loading && <Loading className="mt-4" />
        }
        {
          message && <p>{message}</p>
        }
      </div>
    </div>
  )
}
