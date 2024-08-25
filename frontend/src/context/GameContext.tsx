import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

export interface Grid {
  socketId: string
  matrix: number[][]
}

type Grids = Map<string, number[][]>

export const GameContext = createContext<{
  gameStarted: boolean
  grids: Grids
} | null>(null)
export const GameContextActions = createContext<{
  startGame: VoidFunction
  endGame: VoidFunction
  addGrid: (grid: Grid) => void
} | null>(null)

export const GameContextProvider = ({ children }: PropsWithChildren) => {
  const [gameStarted, setGameStarted] = useState(false)
  const [grids, setGrids] = useState<Grids>(new Map())

  const value = useMemo(() => {
    return {
      gameStarted,
      grids
    }
  }, [gameStarted, grids])

  const startGame = useCallback(() => {
    setGameStarted(true)
  }, [])

  const endGame = useCallback(() => {
    setGameStarted(false)
  }, [])

  // TODO: Rework
  const addGrid = useCallback(({ socketId, matrix }: Grid) => {
    setGrids(prevState => {
      if (prevState.size === 2) {
        return prevState
      }

      return new Map(prevState).set(socketId, matrix)
    })
  }, [])

  const actions = useMemo(() => {
    return {
      startGame,
      endGame,
      addGrid
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (grids.size === 2) {
      startGame()
    }

    return () => {
      endGame()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grids.size])

  return (
    <GameContext.Provider value={value}>
      <GameContextActions.Provider value={actions}>{children}</GameContextActions.Provider>
    </GameContext.Provider>
  )
}
