import { type CSSProperties, type DragEvent, useContext } from 'react'

import { DragContext } from '@/context/DragContext'
import { Cell as CellEntity } from '@/entities/board'
import styles from './Cell.module.css'

interface Props {
  cell: CellEntity
  hitOrMiss: (cell: CellEntity) => void
  triggerRerender: VoidFunction
}

export const Cell = ({ cell, hitOrMiss, triggerRerender }: Props) => {
  const { ship, setShip, dropShip } = useContext(DragContext)

  const handleDrop = (ev: DragEvent) => {
    if (!ship) return

    ev.preventDefault()

    dropShip(ship, cell)
    setShip(null)
  }

  const handleDragOver = (ev: DragEvent) => {
    ev.preventDefault()

    // console.log(123)
  }

  const handleClick = () => {
    if (!cell.isEmpty) return

    hitOrMiss(cell)
    triggerRerender()
  }

  return (
    <div
      className={styles.root}
      style={{
        backgroundColor: getCellColor(cell)
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
    >
      {cell.isHit && 'X'}
      {cell.isMiss && '*'}
    </div>
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

  return 'white'
}
