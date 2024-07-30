import { useMemo } from 'react'

import { Ship } from './Ship'
import { Fleet } from '@/entities/board/Fleet.ts'
import styles from './Port.module.css'

interface Props {
  fleet: Fleet
}

export const Port = ({ fleet }: Props) => {
  const categories = useMemo(() => {
    return [fleet.carries, fleet.battleships, fleet.cruisers, fleet.destroyers, fleet.boats]
  }, [fleet])

  return (
    <section className={styles.root}>
      {categories.map((category, index) => (
        <div key={index} className={styles.berth}>
          {category.map(ship => {
            if (ship.isPlaced) {
              return null
            }

            return <Ship key={ship.id} ship={ship} />
          })}
        </div>
      ))}
    </section>
  )
}
