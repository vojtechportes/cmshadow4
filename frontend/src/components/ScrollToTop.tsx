import React, { useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'

export interface ScrollToTopProps extends RouteComponentProps {
  children: React.ReactNode | React.ReactNodeArray
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  children,
  location,
}) => {
  useEffect(() => { 
    console.log('effect')
    
    window.scrollTo(0, 0) }, [location.pathname])

  return <>{children}</>
}
