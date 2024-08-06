'use server'

import { auth, signIn, signOut } from '@/auth'
import { supabase } from './supabase'
import { revalidatePath } from 'next/cache'
import { getBookings } from './data-service'
import { wait } from './helpers'
import { redirect } from 'next/navigation'
import { Database } from '@/types/supabase'
import { error } from 'console'

export async function updateGuest(formData: FormData) {
  const session = await auth()

  if (!session) throw new Error('You must be logged in')

  const FDnationalID: string = formData.get('nationalID') as string
  const FDnationality: string = formData.get('nationality') as string

  if (!FDnationalID && FDnationalID !== '')
    throw new Error('Please provide a valid national ID')
  if (!FDnationality && FDnationality !== '')
    throw new Error('Please provide a valid nationality')

  const [nationality, countryFlag] = FDnationality.split('%')

  if (!/^[a-zA-Z0-9]{6,12}$/.test(FDnationalID)) {
    throw new Error('Please provide a valid national ID')
  }

  const updateData = { nationality, countryFlag, FDnationalID }

  const { data, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId)
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error('Guest could not be updated')
  }

  revalidatePath('/account/profile')
  return data
}

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' })
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' })
}

////////////////////////////////////////////
// Booking actions

export async function createBooking(
  bookingData: Database['public']['Tables']['bookings']['Insert'],
  formData: FormData,
) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in')
  if (!formData) throw new Error('Form data is missing')
  if (!formData.get('numGuests'))
    throw new Error('Please provide the number of guests')

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations'),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    status: 'unconfirmed',
    isPaid: false,
    hasBreakfast: false,
  } as Database['public']['Tables']['bookings']['Insert']

  const { error } = await supabase
    .from('bookings')
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single()

  if (error) {
    throw new Error('Booking could not be created')
  }
  revalidatePath('/account/reservations')
  revalidatePath(`/cabins/${bookingData.cabinId}`)
  // redirect('/account/reservations')
}

export async function editBooking(formData: FormData) {
  if (!formData) throw new Error('Form data is missing')
  if (!formData.get('bookingId')) throw new Error('Booking ID is missing')
  if (!formData.get('numGuests'))
    throw new Error('Please provide the number of guests')
  if (!formData.get('observations'))
    throw new Error('Please provide the observations')

  const bookingId = Number(formData.get('bookingId'))
  const numGuests = Number(formData.get('numGuests'))
  const observations = formData.get('observations')

  const updatedFields = { numGuests, observations }

  const { error } = await supabase
    .from('bookings')
    .update(updatedFields as Database['public']['Tables']['bookings']['Update'])
    .eq('id', bookingId)

  if (error) {
    console.error(error)
    throw new Error('Booking could not be updated')
  }

  revalidatePath('/account/reservations')
  revalidatePath(`/account/reservations/edit/${bookingId}`)
  redirect('/account/reservations')
}

export async function deleteBooking(bookingId: number) {
  await wait(1)

  const session = await auth()

  if (!session) throw new Error('You must be logged in')

  const guestBookings = await getBookings(session.user.guestId)
  const guestBookingsIds = guestBookings.map((booking) => booking.id)

  if (!guestBookingsIds.includes(bookingId)) {
    throw new Error('You are not authorized to delete this booking')
  }

  const { error } = await supabase.from('bookings').delete().eq('id', bookingId)

  if (error) {
    console.error(error)
    throw new Error('Booking could not be deleted')
  }

  revalidatePath('/account/reservations')
}
