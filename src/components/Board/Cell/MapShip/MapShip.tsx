import { type CSSProperties, useContext } from 'react'

import { DragContext } from '@/context/DragContext'
import { Ship, ShipOrientation } from '@/entities/board/figures/Ship'
import styles from './MapShip.module.css'

interface Props {
  ship: Ship
}

export const MapShip = ({ ship }: Props) => {
  const { rotateShip } = useContext(DragContext)

  const handleRotateShip = () => rotateShip(ship)

  return <div className={styles.root} style={getStyle(ship)} onClick={handleRotateShip} />
}

const getStyle = (ship: Ship): CSSProperties => {
  let style: CSSProperties = {}

  if (ship.isPlaced) {
    style = {
      ...getOffsets(ship.size, ship.orientation),
      transform: `rotate(${ship.orientation === ShipOrientation.HORIZONTAL ? 90 : 180}deg)`
    }
  }

  return {
    ...style,
    '--size': ship.size
  } as CSSProperties
}

const getOffsets = (size: number, orientation: ShipOrientation): Partial<CSSProperties> => {
  if (orientation === ShipOrientation.VERTICAL) {
    return {
      left: 0
    }
  }

  const CELL_SIZE = 40
  const gap = 4
  const middleSize = Math.floor(size / 2)

  let offset: number

  if (size % 2 === 0) {
    offset = CELL_SIZE * middleSize - CELL_SIZE / 2 + middleSize * gap - gap / 2
  } else {
    offset = middleSize * CELL_SIZE + middleSize * gap
  }

  return {
    top: offset
  }
}
