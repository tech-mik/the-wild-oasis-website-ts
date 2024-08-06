import { getBookedDatesByCabinId, getSettings } from '@/lib/data-service'
import DateSelector from './DateSelector'
import ReservationForm from './ReservationForm'
import { auth } from '@/auth'
import LoginMessage from './LoginMessage'
import { Database } from '@/types/supabase'

interface IReservationProps {
  cabin: Database['public']['Tables']['cabins']['Row']
}

export default async function Reservation({ cabin }: IReservationProps) {
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
