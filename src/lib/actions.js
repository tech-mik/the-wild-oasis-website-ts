'use server'

import { auth, signIn, signOut } from '@/auth'
import { supabase } from './supabase'
import { revalidatePath } from 'next/cache'
import { getBookings } from './data-service'
import { wait } from './helpers'
import { redirect } from 'next/navigation'

export async function updateGuest(formData) {
  const session = await auth()

  if (!session) throw new Error('You must be logged in')

  const nationalID = formData.get('nationalID')
  const [nationality, countryFlag] = formData.get('nationality').split('%')

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error('Please provide a valid national ID')
  }

  const updateData = { nationality, countryFlag, nationalID }

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

export async function createBooking(bookingData, formData) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in')

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: +formData.get('numGuests'),
    observations: formData.get('observations'),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    status: 'unconfirmed',
    isPaid: false,
    hasBreakfast: false,
  }

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

export async function editBooking(formData) {
  const bookingId = +formData.get('bookingId')
  const numGuests = +formData.get('numGuests')
  const observations = formData.get('observations')

  const updatedFields = { numGuests, observations }

  const { error } = await supabase
    .from('bookings')
    .update(updatedFields)
    .eq('id', bookingId)

  if (error) {
    console.error(error)
    throw new Error('Booking could not be updated')
  }

  revalidatePath('/account/reservations')
  revalidatePath(`/account/reservations/edit/${bookingId}`)
  redirect('/account/reservations')
}

export async function deleteBooking(bookingId) {
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
