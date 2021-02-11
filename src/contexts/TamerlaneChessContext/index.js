import React, { useContext } from 'react'
import axios from 'axios'
import { useSocket } from '../SocketContext'

const TamerlaneChessContext = React.createContext()

export const useTamerlaneChessContext = () => useContext(TamerlaneChessContext)
const REACT_APP_API_URL = process.env.REACT_APP_API_URL
export const TamerlaneChessProvider = (props) => {
  
  const socket = useSocket()
  const getUser = async (username) => {
    try {
      console.log('process.env', process.env)
      console.log('REACT_APP_API_URL', process.env.REACT_APP_API_URL)
      const res = await axios.get(`${REACT_APP_API_URL}/account/${username}`)
      return res
    } catch (error) {
      throw error
    }
  }

  const acceptPlayRequest = () => {}

  const startGame = () => {}

  const playRequest = async (opponentId) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')).data
    console.log(localStorage)
    console.log('playREquest called')
    console.log(currentUser)
    const payload = {
      black_player: opponentId,
      white_player: currentUser.userId,
      moves: [],
    }

    const recipients = [
      { user: currentUser.id, side: 'w' }, { user: opponentId, side: 'b' }
    ]

    socket.emit('send-playRequest', recipients)
    // const res = await axios.post(`${REACT_APP_API_URL}/play/online/`, payload)
  }

  const sendMove = async (recipients, move) => {
    // socket.emit('send-move', { recipients, move })
  }

  const saveMove = (move) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')).data
    const payload = {
      [currentUser.side]: move,
    }
    axios.put(`${REACT_APP_API_URL}/play/online/`, payload)
  }

  const value = { playRequest, getUser, acceptPlayRequest }
  return (
    <TamerlaneChessContext.Provider value={value}>
      {props.children}
    </TamerlaneChessContext.Provider>
  )
}
