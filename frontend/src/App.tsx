import { useEffect } from 'react'
import { io } from 'socket.io-client'

import { Layout } from '@/components/Layout'
import { RoomContextProvider } from '@/context/RoomContext'
import { useRoomActions } from '@/hooks/useRoomActions'
import { useGameActions } from '@/hooks/useGameActions'
import { type Grid, GameContextProvider } from '@/context/GameContext'
import { SERVER_API, socketConfig } from '@/api/config'
import { WsEvent } from '@/api/events'

export const App = () => {
  const { addGrid, endGame } = useGameActions()
  const { setSocket, setEnemySocketId } = useRoomActions()

  useEffect(() => {
    const socket = io(SERVER_API, socketConfig)

    socket.connect()
    setSocket(socket)

    socket.on(WsEvent.USER_JOINED, (connectedSocketId: string) => {
      setEnemySocketId(connectedSocketId)
    })
    socket.on(WsEvent.RECEIVE_BATTLEFIELD, (grid: Grid | null) => {
      if (!grid) return

      // Enemy`s grid
      addGrid(grid)
    })

    return () => {
      socket.off(WsEvent.USER_JOINED)
      socket.off(WsEvent.ADD_BATTLEFIELD)
      socket.off(WsEvent.RECEIVE_BATTLEFIELD)

      endGame()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <RoomContextProvider>
      <GameContextProvider>
        <Layout />
      </GameContextProvider>
    </RoomContextProvider>
  )
}
