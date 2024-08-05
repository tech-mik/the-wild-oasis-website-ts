'use client'

import { useAuth } from '../../context/AuthContext'

export default function Page() {
  const session = useAuth()

  if (!session) return null

  const { user } = session

  return (
    <h2 className='font-semibold text-2xl text-accent-400 mb-7'>
      Welcome, {user?.name}
    </h2>
  )
}
