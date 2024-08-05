import { getBookedDatesByCabinId, getSettings } from '@/lib/data-service'
import DateSelector from './DateSelector'
import ReservationForm from './ReservationForm'
import { auth } from '@/auth'
import LoginMessage from './LoginMessage'

export default async function Reservation({ cabin }) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ])

  const session = await auth()

  return (
    <div className='grid grid-cols-2 border border-primary-800 min-h-[400px]'>
      <DateSelector
        cabin={cabin}
        settings={settings}
        bookedDates={bookedDates}
      />
      {session?.user ? (
        <ReservationForm cabin={cabin} user={session.user} />
      ) : (
        <LoginMessage />
      )}
    </div>
  )
}
