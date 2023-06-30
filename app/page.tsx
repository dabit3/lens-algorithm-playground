'use client'
import { ethers } from 'ethers'
import { client, challenge, authenticate } from '../api'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    // @ts-ignore
    ethereum: any
  }
}

export default function Home() {
  async function connect() {
    /* this allows the user to connect their wallet */
    const account = await window.ethereum.send('eth_requestAccounts')
    if (account.result.length) {
      return account.result[0]
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
      const { data: { authenticate: { accessToken }}} = authData
      console.log({ accessToken })
      window.localStorage.setItem('lens-algo-app', accessToken)
    } catch (err) {
      console.log('Error signing in: ', err)
    }
  }

  return (
    <main className="flex flex-col items-center justify-between p-14">
      <div>
        <p>
        The Lens Algorithm Playground is meant to give you an overview of various Lens APIs and algorithms available from third party developers.
        </p>
        <p className="mt-5">The currently supported APIs are linked here:</p>
        <a href="https://karma3labs.com/" target="_blank" rel="no-opener">
          <p className="mt-5 text-blue-500">Karma3</p>
        </a>
        <a href="https://docs.airstack.xyz/airstack-docs-and-faqs/reference/api-reference/socials-api/" target="_blank" rel="no-opener">
          <p className="mt-4 text-blue-500">Airstack</p>
        </a>
        <a href="https://docs.madfinance.xyz/api/suggested-follows" target="_blank" rel="no-opener">
          <p className="mt-4 text-blue-500">MadFi</p>
        </a>
        <a href="https://docs.lens.xyz/docs/explore-publications" target="_blank" rel="no-opener">
          <p className="mt-4 text-blue-500">Lens</p>
        </a>

        {/* <p>To use this app, please sign in with Lens.</p>
        <button
          className="
            rounded-full bg-black text-white px-8 py-2 mt-4
          "
          onClick={signIn}
        >Sign in with Lens</button> */}
      </div>
    </main>
  )
}
