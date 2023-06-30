import './globals.css'
import { Inter } from 'next/font/google'
import { LeftNav } from './left-nav'

const inter = Inter({ subsets: ['latin'] })
import Link from 'next/link'

export const metadata = {
  title: 'Lens Algorithm Playground',
  description: 'The Lens Algorithm Playground is meant to give you an overview of various Lens APIs and algorithms available for developers building on Lens Protocol.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <nav>
          <Link href="/" className="
          flex border-b pl-6 flex items-center
          ">
          <img src='/logo.svg' className="w-[50px]" />
          <p className="text-slate-500">Lens Algorithm Playground</p>
          </Link>
        </nav>
        <div className="flex">
          <LeftNav />
          <div className='w-full bg-slate-100 min-h-[calc(100vh-57px)] flex flex-col p-14'>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
