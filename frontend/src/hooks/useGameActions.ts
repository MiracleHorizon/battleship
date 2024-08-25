import { useContext } from 'react'

import { GameContextActions } from '@/context/GameContext'

export const useGameActions = () => {
  const actions = useContext(GameContextActions)

  if (!actions) {
    throw new Error('useGameActions must be used within a GameContextProvider')
  }

  return actions
}
