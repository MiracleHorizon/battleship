import { Layout } from '@/components/Layout'
import { RoomContextProvider } from '@/context/RoomContext'
import { GameContextProvider } from '@/context/GameContext'

export const App = () => {
  return (
    <RoomContextProvider>
      <GameContextProvider>
        <Layout />
      </GameContextProvider>
    </RoomContextProvider>
  )
}
