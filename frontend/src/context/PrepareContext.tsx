import { createContext, type PropsWithChildren, useMemo, useRef } from 'react'

import { Battlefield } from '@/entities/board/Battlefield'

export const PrepareContext = createContext<{
  battlefield: Battlefield
  setBattlefield: (battlefield: Battlefield) => void
} | null>(null)

const defaultBattlefield = new Battlefield()

export const PrepareContextProvider = ({ children }: PropsWithChildren) => {
  const battlefield = useRef(defaultBattlefield)

  const setBattlefield = (bf: Battlefield) => {
    battlefield.current = bf
  }

  const value = useMemo(() => {
    return {
      battlefield: battlefield.current,
      setBattlefield
    }
  }, [])

  return <PrepareContext.Provider value={value}>{children}</PrepareContext.Provider>
}
