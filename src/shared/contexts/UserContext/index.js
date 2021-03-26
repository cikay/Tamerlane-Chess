import React, { useContext } from 'react'
import useLocalStorage from '../../shared/hooks/useLocalStorage'
const UserContext = React.createContext()
export const useUserContext = () => useContext(UserContext)

export function UserProvider({children}) {
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser')

  const value = { currentUser, setCurrentUser }
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
