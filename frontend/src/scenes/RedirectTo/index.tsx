import React, { useEffect } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'

export const RedirectTo: React.FC<RouteComponentProps> = ({
  location: { state },
}) => {
  useEffect(() => {
    navigate((state as any).to)
  }, [state])

  return null
}
