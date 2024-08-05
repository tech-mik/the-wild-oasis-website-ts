import { getCabins } from '@/lib/data-service'
import CabinCard from './CabinCard'
import { TCabinsFilter } from '@/types/cabins'

interface ICabinsListProps {
  filter: TCabinsFilter
}

export default async function CabinsList({ filter }: ICabinsListProps) {
  const cabins = await getCabins()

  if (!cabins.length) return null

  let displayedCabins

  if (filter === 'all') {
    displayedCabins = cabins
  }

  if (filter === 'small') {
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity !== null && cabin?.maxCapacity <= 3,
    )
  }
  if (filter === 'medium') {
    displayedCabins = cabins.filter(
      (cabin) =>
        cabin.maxCapacity !== null &&
        cabin.maxCapacity >= 4 &&
        cabin.maxCapacity <= 7,
    )
  }
  if (filter === 'large') {
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity !== null && cabin.maxCapacity > 8,
    )
  }

  if (!displayedCabins || !displayedCabins.length) {
    return (
      <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14'>
        No cabins to show.
      </div>
    )
  }

  return (
    <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14'>
      {displayedCabins?.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  )
}
