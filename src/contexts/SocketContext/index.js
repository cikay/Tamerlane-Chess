import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export const useSocket = () => useContext(SocketContext)

export function SocketProvider({ children, currentUser }) {
  const [socket, setSocket] = useState()
  console.log('localStorage', localStorage)
  // console.log('currentUser', currentUser)
  // const {currentUser} = useUserContext()
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      query: { id: currentUser?.id },
    })
    console.log('socket in socket context', socket)
    setSocket(newSocket)

    return () => newSocket.close()
  }, [currentUser?.id])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
