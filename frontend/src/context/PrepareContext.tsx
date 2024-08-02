import { createContext } from 'react'

import { Battlefield } from '@/entities/board/Battlefield.ts'

interface Context {
  battlefield: Battlefield
  setBattlefield: (battlefield: Battlefield) => void
}

const defaultValue: Context = {
  battlefield: new Battlefield(),
  setBattlefield() {}
} as const

export const PrepareContext = createContext(defaultValue)
export const PrepareContextProvider = PrepareContext.Provider
