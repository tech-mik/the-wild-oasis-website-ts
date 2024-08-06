'use client'

import { TrashIcon } from '@heroicons/react/24/solid'
import { useState, useTransition } from 'react'
import SpinnerMini from './SpinnerMini'

interface IDeleteReservationProps {
  bookingId: number
  onDelete: (bookingId: number) => Promise<void>
  resetError: () => void
}

function DeleteReservation({
  bookingId,
  onDelete,
  resetError,
}: IDeleteReservationProps) {
  const [isPending, startTransition] = useTransition()
  const [msg, setMsg] = useState(null)

  function handleDelete() {
    if (confirm('Are you sure you want to delete this reservation?')) {
      resetError()
      startTransition(() => onDelete(bookingId))
    }
  }

  return (
    <>
      {msg && <div className='mx-auto text-center text-red-600'>{msg}</div>}
      <button
        disabled={isPending}
        onClick={handleDelete}
        className='group flex justify-center items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900'>
        {isPending ? (
          <SpinnerMini />
        ) : (
          <>
            <TrashIcon className='h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors' />
            <span className='mt-1'>Delete</span>
          </>
        )}
      </button>
    </>
  )
}

export default DeleteReservation
