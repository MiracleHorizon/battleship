import { useContext } from 'react'

import { RoomContextActions } from '@/context/RoomContext'

export const useRoomActions = () => {
  const actions = useContext(RoomContextActions)

  if (!actions) {
    throw new Error('useRoomActions must be used within a RoomContextProvider')
  }

  return actions
}
