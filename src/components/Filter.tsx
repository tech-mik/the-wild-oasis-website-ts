'use client'

import { TCabinsFilter } from '@/types/cabins'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function Filter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const activeFilter = (searchParams.get('capacity') as TCabinsFilter) ?? 'all'

  function handleFilter(filter: TCabinsFilter) {
    const params = new URLSearchParams(searchParams)
    params.set('capacity', filter)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className='border border-primary-800 flex '>
      <Button
        filter='all'
        handleFilter={handleFilter}
        activeFilter={activeFilter}>
        All
      </Button>

      <Button
        filter='small'
        handleFilter={handleFilter}
        activeFilter={activeFilter}>
        1&mdash;3 guest
      </Button>

      <Button
        filter='medium'
        handleFilter={handleFilter}
        activeFilter={activeFilter}>
        4&mdash;7 guest
      </Button>

      <Button
        filter='large'
        handleFilter={handleFilter}
        activeFilter={activeFilter}>
        8&mdash;12 guest
      </Button>
    </div>
  )
}

interface IButtonProps {
  filter: TCabinsFilter
  handleFilter: (filter: TCabinsFilter) => void
  activeFilter: TCabinsFilter
  children: React.ReactNode
}

function Button({
  filter,
  handleFilter,
  activeFilter,
  children,
}: IButtonProps) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${
        activeFilter === filter ? 'bg-primary-700 text-primary-50' : ''
      }`}
      onClick={() => handleFilter(filter)}>
      {children}
    </button>
  )
}
