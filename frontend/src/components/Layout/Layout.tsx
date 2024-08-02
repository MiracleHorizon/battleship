import { useEffect } from 'react'
import { io } from 'socket.io-client'

import { Board } from '@/components/Board'
import { useRoom } from '@/hooks/useRoom'
import { useGameActions } from '@/hooks/useGameActions'
import { useRoomActions } from '@/hooks/useRoomActions'
import { usePrepare } from '@/hooks/usePrepare'
import { SERVER_API, socketConfig } from '@/api/config'
import { WsEvent } from '@/api/events'
import type { Grid } from '@/context/GameContext'
import styles from './Layout.module.css'

export const Layout = () => {
  const { battlefield } = usePrepare()
  const { socket, room } = useRoom()
  const { setSocket, setRoom, setEnemySocketId } = useRoomActions()
  const { addGrid, endGame } = useGameActions()

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

  const handleHandleToRoom = () => {
    if (!socket) return

    if (!room) {
      const room = crypto.randomUUID()
      socket.emit(WsEvent.JOIN_ROOM, room)
      setRoom(room)
    } else {
      socket.emit(WsEvent.JOIN_ROOM, room)
    }
  }

  const handleReady = () => {
    if (!socket || !room) return

    const matrix = battlefield.matrix
    const payload = {
      roomId: room,
      socketId: socket.id,
      battlefield: matrix
    }

    // Self grid
    socket.emit(WsEvent.ADD_BATTLEFIELD, payload)
    addGrid({
      socketId: socket.id!,
      matrix: matrix
    })
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}></header>

      <Board />

      <footer className={styles.footer}>
        <button onClick={handleHandleToRoom}>Join room</button>
        <button onClick={handleReady}>Ready</button>
      </footer>
    </div>
  )
}
