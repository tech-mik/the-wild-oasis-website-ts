'use client'

import { IDateRange } from '@/types/bookings'
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  ReactNode,
} from 'react'

interface IReservationContextProps {
  range: IDateRange
  setRange: Dispatch<SetStateAction<IDateRange>>
  resetRange: () => void
}

const initialState: IDateRange = { from: null, to: null }

const ReservationContext = createContext<IReservationContextProps | undefined>(
  undefined,
)

interface ReservationProviderProps {
  children: ReactNode
}

const ReservationProvider = ({ children }: ReservationProviderProps) => {
  const [range, setRange] = useState<IDateRange>(initialState)

  const resetRange = () => setRange(initialState)

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  )
}

const useReservation = (): IReservationContextProps => {
  const context = useContext(ReservationContext)

  if (context === undefined) {
    throw new Error('useReservation must be used within a ReservationProvider')
  }

  return context
}

export { ReservationProvider, useReservation }
