import { createContext, type PropsWithChildren, useCallback, useMemo, useState } from 'react'

import { useGame } from '@/hooks/useGame'
import { usePrepare } from '@/hooks/usePrepare'
import { Cell as CellEntity, Cell, Ship } from '@/entities/board'
import { ShipOrientation } from '@/entities/board/figures/Ship'

// Using type instead of interface because of the bugs with typescript typings in the context hooks
type ShipToDrag = Ship & {
  shipCellOrder: number
}

export const DragContext = createContext<{
  ship: ShipToDrag | null
} | null>(null)

export const DragContextActions = createContext<{
  setShip: (ship: ShipToDrag | null) => void
  dropShip: (ship: ShipToDrag, cell: Cell) => void
  rotateShip: (ship: Ship) => void
} | null>(null)

export const DragContextProvider = ({ children }: PropsWithChildren) => {
  const [ship, setShip] = useState<ShipToDrag | null>(null)

  const { battlefield } = usePrepare()
  const { gameStarted } = useGame()

  const value = useMemo(() => {
    return {
      ship
    }
  }, [ship])

  const dropShip = useCallback(
    (ship: ShipToDrag, cell: CellEntity) => {
      /*
       * Ships can be placed only when the game is not started.
       */
      if (gameStarted) return

      if (ship.orientation === ShipOrientation.HORIZONTAL) {
        const middle = ship.shipCellOrder + 1
        const right = Math.abs(middle - ship.size) || 0
        const left = ship.size - right - 1 || 0

        battlefield.dropShip.apply(battlefield, [ship, cell, left, right])
      }

      // TODO: Vertical
    },
    [battlefield, gameStarted]
  )

  const rotateShip = useCallback(() => {
    /*
     * Ships can be rotated only when the game is not started.
     */
    if (gameStarted) return

    battlefield.rotateShip.bind(battlefield)
  }, [battlefield, gameStarted])

  const actions = useMemo(() => {
    return {
      dropShip,
      rotateShip,
      setShip
    }
  }, [])

  return (
    <DragContext.Provider value={value}>
      <DragContextActions.Provider value={actions}>{children}</DragContextActions.Provider>
    </DragContext.Provider>
  )
}
