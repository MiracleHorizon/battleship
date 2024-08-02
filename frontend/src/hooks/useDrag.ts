import { useContext } from 'react'

import { DragContext } from '@/context/DragContext'

export const useDrag = () => {
  const drag = useContext(DragContext)

  if (!drag) {
    throw new Error('useDrag must be used within a DragContextProvider')
  }

  return drag
}
