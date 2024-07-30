import { CSSProperties, useContext, useState } from 'react'

import { DragContext } from '@/context/DragContext.tsx'
import { Ship as ShipEntity } from '@/entities/board/figures/Ship.ts'
import styles from './Ship.module.css'

interface Props<T extends ShipEntity> {
  ship: T
}

const ShipCell = ({ setMouseCell, index }: { index: number; setMouseCell: any }) => {
  return (
    <div onMouseDown={() => setMouseCell(index)} className={styles.cell}>
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
      draggable
      className={styles.root}
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
