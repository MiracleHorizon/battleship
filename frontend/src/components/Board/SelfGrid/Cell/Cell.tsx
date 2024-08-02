import type { CSSProperties, DragEvent } from 'react'

import { CellShip } from './CellShip'
import { TableCell } from '@/components/TableCell'
import { useDrag } from '@/hooks/useDrag'
import { useDragActions } from '@/hooks/useDragActions'
import { Cell as CellEntity } from '@/entities/board'
import styles from './Cell.module.css'

interface Props {
  cell: CellEntity
  hitOrMiss: (cell: CellEntity) => void
  triggerRerender: VoidFunction
}

export const Cell = ({ cell, hitOrMiss, triggerRerender }: Props) => {
  const { ship } = useDrag()
  const { dropShip, setShip } = useDragActions()

  const handleDrop = (ev: DragEvent) => {
    if (!ship) return

    ev.preventDefault()

    dropShip(ship, cell)
    setShip(null)
  }

  const handleDragOver = (ev: DragEvent) => {
    ev.preventDefault()
  }

  const handleClick = () => {
    hitOrMiss(cell)
    triggerRerender()
  }

  return (
    <TableCell
      style={{
        backgroundColor: getCellColor(cell)
      }}
      state={0}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      className={styles.root}
    >
      {cell.dependentShip && <CellShip ship={cell.dependentShip} />}
    </TableCell>
  )
}

const getCellColor = (cell: CellEntity): CSSProperties['backgroundColor'] => {
  if (cell.isReserved) {
    return 'gray'
  } else if (cell.isPlaced) {
    return 'lightskyblue'
  } else if (cell.isHit) {
    return 'red'
  } else if (cell.isMiss) {
    return 'yellow'
  }
}
