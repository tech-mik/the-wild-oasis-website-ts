'use client'

import Image from 'next/image'
import { useReservation } from '../context/ReservationContext'
import { differenceInDays } from 'date-fns'
import { createBooking } from '@/lib/actions'
import { Database } from '@/types/supabase'
import { Session, User } from 'next-auth'

interface IReservarionForm {
  cabin: Database['public']['Tables']['cabins']['Row']
  user: User
}

function ReservationForm({ cabin, user }: IReservarionForm) {
  const { range } = useReservation()
  const { id: cabinId, maxCapacity, regularPrice, discount } = cabin
  const { from: startDate, to: endDate } = range

  let numNights
  if (startDate && endDate) {
    numNights = differenceInDays(new Date(endDate), new Date(startDate))
  } else {
    numNights = 0
  }

  let cabinPrice
  if (discount) {
    cabinPrice = regularPrice - (regularPrice * discount) / 100
  } else {
    cabinPrice = regularPrice
  }

  const { resetRange } = useReservation()

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId,
  }

  return (
    <div className='scale-[1.01]'>
      <div className='bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center'>
        <p>Logged in as</p>

        <div className='flex gap-4 items-center'>
          <Image
            width={32}
            height={32}
            referrerPolicy='no-referrer'
            className='h-8 rounded-full'
            src={user?.image || '/user.svg'}
            alt={user?.name || 'User profile picture'}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={async (formData) => {
          await createBooking(bookingData, formData)
          resetRange()
        }}
        className='bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col'>
        <div className='space-y-2'>
          <label htmlFor='numGuests'>How many guests?</label>
          <select
            name='numGuests'
            id='numGuests'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            required>
            <option value='' key=''>
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations'>
            Anything we should know about your stay?
          </label>
          <textarea
            name='observations'
            id='observations'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            placeholder='Any pets, allergies, special requirements, etc.?'
          />
        </div>

        <div className='flex justify-end items-center gap-6'>
          <p className='text-primary-300 text-base'>Start by selecting dates</p>

          <button className='bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300'>
            Reserve now
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReservationForm
