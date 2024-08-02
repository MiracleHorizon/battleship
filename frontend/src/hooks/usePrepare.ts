import { useContext } from 'react'

import { PrepareContext } from '@/context/PrepareContext'

export const usePrepare = () => {
  const prepare = useContext(PrepareContext)

  if (!prepare) {
    throw new Error('usePrepare must be used within a PrepareContextProvider')
  }

  return prepare
}
