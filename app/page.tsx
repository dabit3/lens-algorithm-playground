'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-14">
      <div>
        <p>
        The Lens Algorithm Playground is meant to give you an overview of various Lens APIs and algorithms available for developers building on Lens Protocol.
        </p>
        <p className="mt-5">The currently supported APIs are linked here:</p>
        
        <Link href="/karma3">
          <p className="text-xl text-slate-400 mt-4">Karma3</p>
        </Link>
        <a href="https://karma3labs.com/" target="_blank" rel="no-opener">
          <p className="mt-1 text-blue-500">Docs</p>
        </a>
        <Link href="/madfi">
          <p className="text-xl text-slate-400 mt-4">MadFi</p>
        </Link>
        <a href="https://docs.madfinance.xyz/api/suggested-follows" target="_blank" rel="no-opener">
          <p className="mt-1 text-blue-500">Docs</p>
        </a>
        <Link href="/lens">
          <p className="text-xl text-slate-400 mt-4">Lens</p>
        </Link>
        <a href="https://docs.lens.xyz/docs/explore-publications" target="_blank" rel="no-opener">
          <p className="mt-1 text-blue-500">Docs</p>
        </a>
        <Link href='airstack'>
          <p className="text-xl text-slate-400 mt-4">Airstack</p>
        </Link>
        <a href="https://docs.airstack.xyz/airstack-docs-and-faqs/reference/api-reference/socials-api/" target="_blank" rel="no-opener">
          <p className="mt-1 text-blue-500">Docs</p>
        </a>
      </div>
    </main>
  )
}
