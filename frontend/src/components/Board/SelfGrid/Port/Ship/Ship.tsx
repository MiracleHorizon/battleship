import { type CSSProperties, type Dispatch, type SetStateAction, useContext, useState } from 'react'
import clsx from 'clsx'

import { DragContext } from '@/context/DragContext'
import { Ship as ShipEntity } from '@/entities/board/figures/Ship'
import styles from './Ship.module.css'

interface Props<T extends ShipEntity> {
  ship: T
}

// TODO: Touch events
const ShipCell = ({
  setMouseCell,
  index
}: {
  index: number
  setMouseCell: Dispatch<SetStateAction<number>>
}) => {
  const handleMouseDown = () => setMouseCell(index)

  return (
    <div onMouseDown={handleMouseDown} className={styles.cell}>
      {index}
    </div>
  )
}

export const Ship = <T extends ShipEntity>({ ship }: Props<T>) => {
  const [mouseCell, setMouseCell] = useState(-1)
  const { setShip } = useContext(DragContext)

  const handleDragStart = () => {
    if (mouseCell < 0) return

    const dragShip = Object.assign(ship, {
      shipCellOrder: mouseCell
    })

    setShip(dragShip)
    setMouseCell(-1)
  }

  const style = {
    '--size': ship.size
  } as CSSProperties

  return (
    <div
      draggable={!ship.isPlaced}
      className={clsx(styles.root, {
        [styles.placed]: ship.isPlaced
      })}
      style={style}
      data-ship={ship.type}
      onDragStart={handleDragStart}
    >
      {new Array(ship.size).fill(0).map((_, index) => (
        <ShipCell key={index} index={index} setMouseCell={setMouseCell} />
      ))}
    </div>
  )
}
