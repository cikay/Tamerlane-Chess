import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export const useSocket = () => useContext(SocketContext)

export function SocketProvider({  children }) {
  const [socket, setSocket] = useState()
  const id = 2
  useEffect(() => {
    const newSocket = io('http://localhost:5000', { query: { id } })

    setSocket(newSocket)

    return () => newSocket.close()
  }, [id])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
