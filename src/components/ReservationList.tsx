'use client'

import { deleteBooking } from '@/lib/actions'
import { useOptimistic, useState } from 'react'
import ReservationCard from './ReservationCard'
import { Database } from '@/types/supabase'

interface Cabin {
  name: string
  image: string
}

type ExtendedBooking = Database['public']['Tables']['bookings']['Row'] & {
  cabins: Cabin
}

interface IReservationListProps {
  bookings: ExtendedBooking[]
}

export default function ReservationList({ bookings }: IReservationListProps) {
  const [error, setError] = useState<string | null>(null)
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId)
    },
  )

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId)

    try {
      await deleteBooking(bookingId)
    } catch (err) {
      console.error('Error occurred during deletion:', err)

      if (err instanceof Error) {
        setError(err?.message)
      }
    }
  }

  return (
    <>
      {error ? (
        <div
          onClick={() => setError(null)}
          className='text-red-600 text-center'>
          {error}
        </div>
      ) : (
        ''
      )}
      <ul className='space-y-6'>
        {optimisticBookings.map((booking) => (
          <ReservationCard
            booking={booking}
            key={booking.id}
            onDelete={handleDelete}
            resetError={() => setError(null)}
          />
        ))}
      </ul>
    </>
  )
}
