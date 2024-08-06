'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import SpinnerMini from './SpinnerMini'
import Image from 'next/image'

export default function User() {
  const session = useAuth()

  if (!session) {
    throw new Error('Not authenticated')
  }

  const { user, loading } = session

  if (loading) return <SpinnerMini />

  return (
    <li>
      {user?.image ? (
        <Link
          href='/account'
          className='hover:text-accent-400 transition-colors flex items-center gap-4'>
          <Image
            width={32}
            height={32}
            src={user.image}
            alt={user.name || 'Unknown'}
            className='rounded-full'
            referrerPolicy='no-referrer'
          />
          <span>Guest area</span>
        </Link>
      ) : (
        <Link
          href='/account'
          className='hover:text-accent-400 transition-colors flex items-center gap-4'>
          <span>Guest area</span>
        </Link>
      )}
    </li>
  )
}
