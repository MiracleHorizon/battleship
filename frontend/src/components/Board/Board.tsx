import { SelfGrid } from './SelfGrid'
import { EnemyGrid } from './EnemyGrid'
import styles from './Board.module.css'

export const Board = () => {
  return (
    <main className={styles.root}>
      <SelfGrid />
      <EnemyGrid />
    </main>
  )
}
