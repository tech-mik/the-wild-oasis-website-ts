import Image from 'next/image'
import Link from 'next/link'
import bg from '@/../public/bg.webp'

export default function Page() {
  return (
    <main className='mt-24'>
      <Image
        src={bg}
        fill
        alt='Mountains and forests with two cabins'
        className='object-top object-cover'
        placeholder='blur'
        quality={40}
      />

      <div className='relative z-10 text-center'>
        <h1 className='mb-10 font-normal text-8xl text-primary-50 tracking-tight'>
          Welcome to paradise.
        </h1>
        <Link
          href='/cabins'
          className='bg-accent-500 hover:bg-accent-600 px-8 py-6 font-semibold text-lg text-primary-800 transition-all'>
          Explore luxury cabins
        </Link>
      </div>
    </main>
  )
}
