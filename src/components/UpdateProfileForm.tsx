'use client'

import { updateGuest } from '@/lib/actions'
import { Database } from '@/types/supabase'
import { error } from 'console'
import Image from 'next/image'
import { useFormStatus } from 'react-dom'

interface IUpdateProfileFormProps {
  SelectCountry: JSX.Element
  guest: Database['public']['Tables']['guests']['Row']
}

export default function UpdateProfileForm({
  SelectCountry,
  guest,
}: IUpdateProfileFormProps) {
  const { fullName, email, nationalID, countryFlag } = guest

  async function handleSubmit(formData: FormData) {
    try {
      const data = await updateGuest(formData)

      console.log(data)
    } catch (error) {
      if (error instanceof Error) alert(error.message)
    }
  }

  return (
    <form
      action={handleSubmit}
      className='bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col'>
      <div className='space-y-2'>
        <label>Full name</label>
        <input
          disabled
          className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400'
          defaultValue={fullName}
          name='fullName'
        />
      </div>

      <div className='space-y-2'>
        <label>Email address</label>
        <input
          disabled
          className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400'
          defaultValue={email}
          name='email'
        />
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <label htmlFor='nationality'>Where are you from?</label>
          <Image
            width={20}
            height={20}
            src={countryFlag || '/flags/unknown.png'}
            alt='Country flag'
            className='rounded-sm'
          />
        </div>
        {SelectCountry}
      </div>

      <div className='space-y-2'>
        <label htmlFor='nationalID'>National ID number</label>
        <input
          defaultValue={nationalID || ''}
          name='nationalID'
          className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
        />
      </div>

      <div className='flex justify-end items-center gap-6'>
        <Button />
      </div>
    </form>
  )
}

function Button() {
  const { pending } = useFormStatus()

  return (
    <button
      disabled={pending}
      className='bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 '>
      {pending ? 'Updating...' : 'Update profile'}
    </button>
  )
}
