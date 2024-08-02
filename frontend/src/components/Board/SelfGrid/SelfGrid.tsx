import { useContext, useState } from 'react'

import { Cell } from './Cell'
import { Port } from './Port'
import { TableHead } from '@/components/TableHead'
import { PrepareContext } from '@/context/PrepareContext'
import { DragContextProvider, type DragShip } from '@/context/DragContext'
import { useGame } from '@/hooks/useGame.ts'
import { Cell as CellEntity } from '@/entities/board'
import { ShipOrientation } from '@/entities/board/figures/Ship'
import styles from './SelfGrid.module.css'

export const SelfGrid = () => {
  const [dragShip, setDragShip] = useState<DragShip | null>(null)
  const { battlefield } = useContext(PrepareContext)
  const { gameStarted } = useGame()

  const rerender = useState(0)[1]
  const triggerRerender = () => rerender(prevState => prevState + 1)

  const dropShip = (ship: DragShip, cell: CellEntity) => {
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
  }

  const rotateShip = () => {
    /*
     * Ships can be rotated only when the game is not started.
     */
    if (gameStarted) return

    battlefield.rotateShip.bind(battlefield)
  }

  const hitOrMiss = (cell: CellEntity) => {
    /*
     * Shots can only be thrown after the game has started.
     */
    if (!gameStarted) return

    battlefield.hitOrMiss.call(battlefield, cell)
  }

  return (
    <div className={styles.root}>
      <DragContextProvider
        value={{
          ship: dragShip,
          setShip: setDragShip,
          dropShip,
          rotateShip
        }}
      >
        {!gameStarted && <Port fleet={battlefield.fleet} />}

        <table>
          <TableHead />

          <tbody>
            {battlefield.cellsMatrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map(cell => (
                  <Cell
                    key={cell.id}
                    cell={cell}
                    hitOrMiss={hitOrMiss}
                    triggerRerender={triggerRerender}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DragContextProvider>
    </div>
  )
}
