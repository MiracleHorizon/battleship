import { Layout } from '@/components/Layout'
import { RoomContextProvider } from '@/context/RoomContext'
import { GameContextProvider } from '@/context/GameContext'
import { PrepareContextProvider } from '@/context/PrepareContext'

export const App = () => (
  <RoomContextProvider>
    <GameContextProvider>
      <PrepareContextProvider>
        <Layout />
      </PrepareContextProvider>
    </GameContextProvider>
  </RoomContextProvider>
)
