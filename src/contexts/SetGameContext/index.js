import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { useSocket } from '../SocketContext'
import { getPlayersColor } from '../../helper/Fen'

import { COLOR } from '../../tamerlane-chess/types'
const PLAY_STATE = {
  Accepted: 'accepted',
  Cancelled: 'canceled',
}

const SetGameContext = React.createContext()

export const useSetGameContext = () => useContext(SetGameContext)
const REACT_APP_API_URL = process.env.REACT_APP_API_URL
export const SetGameProvider = (props) => {
  const [request, setRequest] = useState()
  const [state, setState] = useState({
    currentPlayer: '',
    opponentPlayer: '',
  })

  const history = useHistory()

  const [response, setResponse] = useState(null)
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

  const resetRequest = () => {
    setRequest(null)
  }

  const acceptPlayRequest = () => {}

  const startGame = () => {}

  const playRequest = async (playerId) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')).data
    console.log(localStorage)
    console.log('playRequest called')
    console.log(currentUser)

    console.log('currentUser', currentUser)
    console.log(localStorage)
    const { currentPlayerColor, opponentPlayerColor } = getPlayersColor()
    const requestedPlayer = {
      username: currentUser.username,
      id: currentUser.userId,
      side: currentPlayerColor,
    }

    socket.emit('send-playRequest', {
      recipientId: playerId,
      senderPlayer: requestedPlayer,
    })
    setState({
      currentPlayer: requestedPlayer,
      opponentPlayer: { id: playerId, side: opponentPlayerColor },
    })
  }

  const playRequestResponse = () => {}

  const sendPlayResponse = (requestedPlayer, response) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')).data
    console.log('response', response)
    if (!response) {
      //show message in ui

      console.log('istek reddedildi')
      socket.emit('send-playRequestResponse', {
        recepientId: requestedPlayer.id,
        response: false,
      })
      return
    }
    //set game
    console.log('requested player in sendPlayResponse', requestedPlayer)
    let currentPlayer
    let white_player
    let black_player
    if (requestedPlayer.side === COLOR.white) {
      white_player = requestedPlayer
      black_player = {
        username: currentUser.username,
        id: currentUser.userId,
        side: COLOR.black,
      }
      currentPlayer = black_player
    } else {
      white_player = {
        username: currentUser.username,
        id: currentUser.userId,
        side: COLOR.white,
      }
      currentPlayer = white_player
      black_player = requestedPlayer
    }

    const payload = {
      black_player,
      white_player,
      moves: [],
    }
    console.log('istek kabul edildi')
    console.log(requestedPlayer)
    console.log('requested player', requestedPlayer.id)
    socket.emit('send-playResponse', {
      recipientId: requestedPlayer.id,
      response: true,
    })
    console.log('currentPlayer', currentPlayer)
    console.log('opponent player', requestedPlayer)
    setState({
      currentPlayer: currentPlayer,
      opponentPlayer: requestedPlayer,
    })

    history.push('/play')
    // const res = axios.post(`${REACT_APP_API_URL}/play/online/`, payload)
  }

  const getPlayResponse = (response) => {
    if (!response) {
      console.log('getPlayResponse invoked')
      setResponse(PLAY_STATE.Cancelled)
      return
    }
  }

  useEffect(() => {
    if (socket == null) return
    socket.on('receive-playResponse', ({ response }) => {
      console.log('response received')
      console.log('response', response)
      if (response) {
        history.push('/play')
      }
    })
    return () => socket.off('receive-playResponse')
  }, [socket])

  useEffect(() => {
    if (socket == null) return

    socket.on('receive-playRequest', ({ recipientId, senderPlayer }) => {
      console.log('recipient', recipientId)
      console.log('sender', senderPlayer)
      setRequest(senderPlayer)
    })

    return () => socket.off('receive-playRequest')
  }, [socket])

  const value = {
    ...state,
    playRequest,
    getUser,
    acceptPlayRequest,
    request,
    resetRequest,
    sendPlayResponse,
    getPlayResponse,
    response,
    PLAY_STATE,
  }

  return (
    <SetGameContext.Provider value={value}>
      {props.children}
    </SetGameContext.Provider>
  )
}
