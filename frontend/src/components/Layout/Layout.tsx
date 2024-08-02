import { useRef } from 'react'

import { Board } from '../Board'
import { PrepareContextProvider } from '@/context/PrepareContext'
import { useRoom } from '@/hooks/useRoom'
import { useGameActions } from '@/hooks/useGameActions'
import { useRoomActions } from '@/hooks/useRoomActions'
import { Battlefield } from '@/entities/board/Battlefield'
import { WsEvent } from '@/api/events'
import styles from './Layout.module.css'

const defaultBattlefield = new Battlefield()

export const Layout = () => {
  const battlefield = useRef(defaultBattlefield)
  const { socket, room } = useRoom()
  const { setRoom } = useRoomActions()
  const { addGrid } = useGameActions()

  const setBattlefield = (bf: Battlefield) => (battlefield.current = bf)

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

    const matrix = battlefield.current.matrix
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

      <PrepareContextProvider
        value={{
          battlefield: battlefield.current,
          setBattlefield
        }}
      >
        <Board />
      </PrepareContextProvider>

      <footer className={styles.footer}>
        <button onClick={handleHandleToRoom}>Join room</button>
        <button onClick={handleReady}>Ready</button>
      </footer>
    </div>
  )
}
