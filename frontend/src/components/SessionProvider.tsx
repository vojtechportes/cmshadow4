import React, { createContext, useState } from 'react'
import Cookies from 'js-cookie'

export interface SessionProviderContextProps {
  isLoggedIn: boolean
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

export const SessionProviderContext = createContext<SessionProviderContextProps>(
  {} as SessionProviderContextProps
)

export interface SessionProviderProps {
  children: React.ReactNode | React.ReactNodeArray
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('AUTH_TOKEN_CLIENT'))

  return (
    <SessionProviderContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </SessionProviderContext.Provider>
  )
}
