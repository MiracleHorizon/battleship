import type { HTMLAttributes, PropsWithChildren } from 'react'
import clsx from 'clsx'

import type { CellState } from '@/types/CellState'
import styles from './TableCell.module.css'

interface Props extends PropsWithChildren<HTMLAttributes<HTMLTableCellElement>> {
  state: CellState
}

export const TableCell = ({ children, state, className, ...props }: Props) => (
  <td
    className={clsx(
      styles.root,
      {
        [styles.empty]: state === 0,
        [styles.hit]: state === 1,
        [styles.missed]: state === 2,
        [styles.reserved]: state === 3
      },
      className
    )}
    {...props}
  >
    {children}
  </td>
)
