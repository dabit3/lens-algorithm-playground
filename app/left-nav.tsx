'use client'
import { useSelectedLayoutSegment } from 'next/navigation'
import Link from 'next/link'

export function LeftNav() {
  const segment = useSelectedLayoutSegment()
  return (
    <div className="
      flex flex-col border-r px-4 py-4 w-44
    ">
      <Link href="/">
        <p className={`
          mb-2 rounded-lg px-3 py-2 ${!segment ? "bg-slate-200 text-black" : 'text-gray-400 '}
        `}>
        Home
        </p>
      </Link>
      <Link href="/karma3">
        <p className={`
         mb-2 rounded-lg px-3 py-2 ${segment === 'karma3' ? "bg-slate-200	text-black" : 'text-gray-400 '}
        `}>
        Karma3
        </p>
      </Link>
      <Link href="/madfi">
        <p className={`
          mb-2 rounded-lg px-3 py-2 ${segment === 'madfi' ?
          "bg-slate-100text-black" : 'text-gray-400 '}
        `}>
        MadFi
        </p>
      </Link>
      <Link href="/lens">
        <p className={`
          mb-2 rounded-lg px-3 py-2 ${segment === 'lens' ?
          "bg-slate-100text-black" : 'text-gray-400 '}
        `}>
        Lens
        </p>
      </Link>
      <Link href="/airstack">
        <p className={`
          mb-2 rounded-lg px-3 py-2 ${segment === 'airstack' ? 
          "bg-slate-100	text-black" : 'text-gray-400 '}
        `}>
        Airstack
        </p>
      </Link>
      <div>
        <a href="https://github.com/dabit3/lens-algorithm-playground" target="_blank" rel="no-opener">
        <img src="/github.svg" className="w-[40px]" />
        </a>
      </div>
    </div>
  )
}