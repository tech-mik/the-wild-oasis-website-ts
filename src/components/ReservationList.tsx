'use client'

import { deleteBooking } from '@/lib/actions'
import { useOptimistic, useState } from 'react'
import ReservationCard from './ReservationCard'

export default function ReservationList({ bookings }) {
  const [error, setError] = useState(null)
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId)
    },
  )

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId)

    try {
      await deleteBooking(bookingId)
    } catch (err) {
      console.error('Error occurred during deletion:', err)
      setError(err.message)
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
