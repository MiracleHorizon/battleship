import styles from './TableHead.module.css'

const TABLE_HEAD = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] as const

export const TableHead = () => (
  <thead>
    <tr>
      {TABLE_HEAD.map(col => (
        <th key={col} className={styles.cell}>
          {col}
        </th>
      ))}
    </tr>
  </thead>
)
