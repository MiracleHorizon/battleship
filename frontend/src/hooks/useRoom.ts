import { useContext } from 'react'

import { RoomContext } from '@/context/RoomContext'

export const useRoom = () => {
  const room = useContext(RoomContext)

  if (!room) {
    throw new Error('useRoom must be used within a RoomContextProvider')
  }

  return room
}
