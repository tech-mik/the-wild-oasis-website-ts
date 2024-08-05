import Cabin from '@/components/Cabin'
import Reservation from '@/components/Reservation'
import Spinner from '@/components/Spinner'
import { getCabin, getCabins } from '@/lib/data-service'
import { Suspense } from 'react'

export async function generateMetadata({ params: { cabinId } }) {
  const cabin = await getCabin(cabinId)
  return {
    title: `Cabin ${cabin.name}`,
    description: cabin.description,
    image: cabin.image,
  }
}

export async function generateStaticParams() {
  const cabins = await getCabins()
  return cabins.map(({ id }) => ({ cabinId: String(id) }))
}

export default async function Page({ params: { cabinId }, searchParams }) {
  const cabin = await getCabin(cabinId)

  return (
    <div className='max-w-6xl mx-auto mt-8'>
      <Cabin cabin={cabin} />

      <div>
        <h2 className='text-5xl font-semibold text-center mb-10 text-accent-400'>
          Reserve {cabin.name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  )
}
