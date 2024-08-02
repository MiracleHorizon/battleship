import { useContext } from 'react'

import { DragContextActions } from '@/context/DragContext'

export const useDragActions = () => {
  const dragActions = useContext(DragContextActions)

  if (!dragActions) {
    throw new Error('useDragActions must be used within a DragContextProvider')
  }

  return dragActions
}
