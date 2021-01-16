import React, { useContext } from 'react'

const TamerlaneChessContext = React.createContext()

export const useTamerlaneChessContext = () => useContext(TamerlaneChessContext)

export const TamerlaneChessProvider = (props) => {
  value = {}
  return (
    <TamerlaneChessContext.Provider value={value}>
      {props.children}
    </TamerlaneChessContext.Provider>
  )
}
