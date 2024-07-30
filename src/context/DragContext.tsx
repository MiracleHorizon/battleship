import { createContext } from 'react'

import { Ship } from '@/entities/board/figures/Ship.ts'
import { Cell } from '@/entities/board'

export interface DragShip extends Ship {
  shipCellOrder: number
}

export const DragContext = createContext<{
  ship: DragShip | null
  setShip: (ship: DragShip | null) => void
  dropShip: (ship: DragShip, cell: Cell) => void
}>({
  ship: null,
  setShip() {},
  dropShip() {}
})

export const DragContextProvider = DragContext.Provider
