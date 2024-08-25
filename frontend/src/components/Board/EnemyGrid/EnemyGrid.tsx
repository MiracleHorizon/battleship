import { useEffect, useState } from 'react'
import clsx from 'clsx'

import { TableHead } from '@/components/TableHead'
import { TableCell } from '@/components/TableCell'
import { useGame } from '@/hooks/useGame'
import { useRoom } from '@/hooks/useRoom'
import { WsEvent } from '@/api/events'
import type { CellState } from '@/types/CellState'
import styles from './EnemyGrid.module.css'

interface CellProps {
  state: CellState
  row: number
  col: number
}

const defaultMatrix: CellState[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
] as const

const Cell = ({ state, row, col }: CellProps) => {
  const { socket, room, enemySocketId } = useRoom()

  const handleClick = () => {
    if (!socket || !enemySocketId || !room) return

    socket.emit(WsEvent.REGISTER_SHOT, room, enemySocketId, {
      col,
      row
    })
  }

  return <TableCell state={state} onClick={handleClick} />
}

export const EnemyGrid = () => {
  const [matrix, setMatrix] = useState(defaultMatrix)
  const { socket } = useRoom()
  const { gameStarted } = useGame()

  useEffect(() => {
    if (!socket) return

    socket.on(WsEvent.APPLY_SHOT, ({ cellState, row, col }) => {
      setMatrix(prevState => {
        const newMatrix = [...prevState]
        newMatrix[row][col] = cellState
        return newMatrix
      })
    })

    return () => {
      socket.off(WsEvent.APPLY_SHOT)
    }
  }, [socket])

  return (
    <div
      className={clsx({
        [styles.disabled]: !gameStarted
      })}
    >
      <table>
        <TableHead />

        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((state, colIndex) => (
                <Cell key={colIndex} state={state} row={rowIndex} col={colIndex} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
