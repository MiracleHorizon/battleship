import { createContext } from 'react'

import type { Cell, Ship } from '@/entities/board'

export interface DragShip extends Ship {
  shipCellOrder: number
}

interface Context {
  ship: DragShip | null
  setShip: (ship: DragShip | null) => void
  dropShip: (ship: DragShip, cell: Cell) => void
  rotateShip: (ship: Ship) => void
}

export const DragContext = createContext({} as Context)
export const DragContextProvider = DragContext.Provider
