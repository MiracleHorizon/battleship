import { useState } from 'react'

import { Cell } from './Cell'
import { Port } from './Port'
import { TableHead } from '@/components/TableHead'
import { DragContextProvider } from '@/context/DragContext'
import { usePrepare } from '@/hooks/usePrepare'
import { useGame } from '@/hooks/useGame'
import { Cell as CellEntity } from '@/entities/board'
import styles from './SelfGrid.module.css'

export const SelfGrid = () => {
  const { battlefield } = usePrepare()
  const { gameStarted } = useGame()

  const rerender = useState(0)[1]
  const triggerRerender = () => rerender(prevState => prevState + 1)

  const hitOrMiss = (cell: CellEntity) => {
    /*
     * Shots can only be thrown after the game has started.
     */
    if (!gameStarted) return

    battlefield.hitOrMiss.call(battlefield, cell)
  }

  return (
    <div className={styles.root}>
      <DragContextProvider>
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
