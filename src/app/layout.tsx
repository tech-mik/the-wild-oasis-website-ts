import Header from '@/components/Header'
import { ReservationProvider } from '@/context/ReservationContext'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import '@/styles/globals.css'

import { SessionProvider } from 'next-auth/react'
import { Josefin_Sans } from 'next/font/google'
import { AuthProvider } from '../context/AuthContext'

const josefin = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: {
    template: '%s / The Wild Oasis',
    default: 'Welcome / The Wild Oasis',
  },
  description:
    'Luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AuthProvider>
        <html lang='en'>
          <body
            className={`${josefin.className} bg-primary-950 text-primary-100 min-h-screen flex flex-col antialiased `}>
            <Header />
            <div className='flex-1 px-8 py-12 grid '>
              <main className='max-w-7xl mx-auto w-full'>
                <ReservationProvider>{children}</ReservationProvider>
              </main>
            </div>
            <SpeedInsights />
            <Analytics />
          </body>
        </html>
      </AuthProvider>
    </SessionProvider>
  )
}
