import { useCallback, useEffect, useState } from 'react'

import { Cell } from './Cell'
import { Port } from './Port'
import { DragContextProvider, type DragShip } from '@/context/DragContext.tsx'
import { ShipOrientation } from '@/entities/board/figures/Ship.ts'
import { Board as BoardEntity, Cell as CellEntity } from '@/entities/board'
import styles from './Board.module.css'

export const Board = () => {
  const [board] = useState(new BoardEntity())
  const [dragShip, setDragShip] = useState<DragShip | null>(null)

  const rerender = useState(0)[1]
  const triggerRerender = () => rerender(prevState => prevState + 1)

  const dropShip = useCallback(
    (ship: DragShip, cell: CellEntity) => {
      if (ship.orientation === ShipOrientation.HORIZONTAL) {
        const middle = ship.shipCellOrder + 1
        const right = Math.abs(middle - ship.size) || 0
        const left = ship.size - right - 1 || 0

        board.dropShip.apply(board, [ship, cell, left, right])
      }
    },
    [board]
  )

  useEffect(() => {
    board.startGame()
  }, [board])

  return (
    <div className={styles.root}>
      <DragContextProvider value={{ ship: dragShip, setShip: setDragShip, dropShip }}>
        <Port fleet={board.fleet} />

        <div className={styles.map}>
          {board.cells.map((cellRow, index) => (
            <div key={index}>
              {cellRow.map(cell => (
                <Cell
                  key={cell.id}
                  cell={cell}
                  hitOrMiss={board.hitOrMiss.bind(board)}
                  triggerRerender={triggerRerender}
                />
              ))}
            </div>
          ))}
        </div>
      </DragContextProvider>
    </div>
  )
}
