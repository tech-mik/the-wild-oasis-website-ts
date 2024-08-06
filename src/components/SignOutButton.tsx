'use client'

import { useAuth } from '@/context/AuthContext'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid'

function SignOutButton() {
  const session = useAuth()
  if (!session) throw new Error('You must be logged in to sign out')

  const { signOut } = session

  return (
    <button
      onClick={signOut}
      className='py-3 px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-center gap-4 font-semibold text-primary-200 w-full'>
      <ArrowRightOnRectangleIcon className='h-5 w-5 text-primary-600' />
      <span>Sign out</span>
    </button>
  )
}

export default SignOutButton
