import { type CSSProperties, useContext } from 'react'
import clsx from 'clsx'

import { DragContext } from '@/context/DragContext'
import { Ship, ShipOrientation } from '@/entities/board/figures/Ship'
import styles from './CellShip.module.css'

interface Props {
  ship: Ship
}

export const CellShip = ({ ship }: Props) => {
  const { rotateShip } = useContext(DragContext)

  const handleRotateShip = () => rotateShip(ship)

  const style = {
    '--size': ship.size
  } as CSSProperties

  return (
    <div
      className={clsx(styles.root, {
        [styles.horizontal]: ship.orientation === ShipOrientation.HORIZONTAL,
        [styles.vertical]: ship.orientation === ShipOrientation.VERTICAL
      })}
      style={style}
      onClick={handleRotateShip}
    />
  )
}
