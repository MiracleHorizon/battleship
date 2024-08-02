import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useMemo,
  useState
} from 'react'
import type { Socket } from 'socket.io-client'

export const RoomContext = createContext<{
  room: string | null
  socket: Socket | null
  enemySocketId: string | null
} | null>(null)

export const RoomContextActions = createContext<{
  setRoom: Dispatch<SetStateAction<string | null>>
  setSocket: Dispatch<SetStateAction<Socket | null>>
  setEnemySocketId: Dispatch<SetStateAction<string | null>>
} | null>(null)

export const RoomContextProvider = ({ children }: PropsWithChildren) => {
  const [room, setRoom] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [enemySocketId, setEnemySocketId] = useState<string | null>(null)

  const value = useMemo(() => {
    return {
      room,
      socket,
      enemySocketId
    }
  }, [room, socket, enemySocketId])

  const actions = useMemo(() => {
    return {
      setRoom,
      setSocket,
      setEnemySocketId
    }
  }, [])

  return (
    <RoomContext.Provider value={value}>
      <RoomContextActions.Provider value={actions}>{children}</RoomContextActions.Provider>
    </RoomContext.Provider>
  )
}
