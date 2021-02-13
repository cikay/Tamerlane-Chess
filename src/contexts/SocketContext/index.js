import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import useLocalStorage from '../../hooks/useLocalStorage'

const SocketContext = React.createContext()

export const useSocket = () => useContext(SocketContext)

export function SocketProvider({ id, children }) {
  const [socket, setSocket] = useState()
  console.log('localStorage', localStorage)

  console.log('id', id)
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      query: { id },
    })

    setSocket(newSocket)

    return () => newSocket.close()
  }, [id])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
