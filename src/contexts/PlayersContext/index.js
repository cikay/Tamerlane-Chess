import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { useSocket } from '../SocketContext'
import { getPlayersColor } from '../../helper/Fen'

import { COLOR } from '../../tamerlane-chess/types'
import useLocalStorage from '../../hooks/useLocalStorage'
const PLAY_STATE = {
  Accepted: 'accepted',
  Cancelled: 'canceled',
}

const PlayersContext = React.createContext()

export const usePlayersContext = () => useContext(PlayersContext)
const REACT_APP_API_URL = process.env.REACT_APP_API_URL
export const PlayersProvider = ({ currentUser, children }) => {
  const [request, setRequest] = useState()
  const [state, setState] = useState({
    gameId: '',
    currentPlayer: '',
    opponentPlayer: '',
    users: "",
  })

  const resetUsers = () => {
    setState((prevState) => ({ ...prevState, users: [] }))
  }

  const history = useHistory()

  const [response, setResponse] = useState(null)
  const socket = useSocket()
  const getUser = async (username) => {
    try {
      console.log('process.env', process.env)
      console.log('REACT_APP_API_URL', process.env.REACT_APP_API_URL)
      const res = await axios.get(`${REACT_APP_API_URL}/account/${username}`)
      setState((prevState) => ({ ...prevState, users: res.data }))
      return res
    } catch (error) {
      throw error
    }
  }

  const resetRequest = () => {
    setRequest(null)
  }

  const acceptPlayRequest = () => {}

  const playRequest = async (playerId) => {
    console.log('playRequest called')

    const { currentPlayerColor, opponentPlayerColor } = getPlayersColor()
    const requestedPlayer = {
      username: currentUser.username,
      id: currentUser.id,
      side: currentPlayerColor,
    }

    console.log('currentPlayerColor', currentPlayerColor)
    console.log('opponentPlayerColor', opponentPlayerColor)

    socket.emit('send-playRequest', {
      recipientId: playerId,
      senderPlayer: requestedPlayer,
    })
    setState((prevState) => ({
      ...prevState,
      currentPlayer: requestedPlayer,
      opponentPlayer: { id: playerId, side: opponentPlayerColor },
    }))
  }

  const sendPlayResponse = async (requestedPlayer, response) => {
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
        id: currentUser.id,
        side: COLOR.black,
      }
      currentPlayer = black_player
    } else {
      white_player = {
        username: currentUser.username,
        id: currentUser.id,
        side: COLOR.white,
      }
      currentPlayer = white_player
      black_player = requestedPlayer
    }

    const payload = {
      black_player: black_player.id,
      white_player: white_player.id,
      moves: [],
    }
    console.log('istek kabul edildi')
    console.log(requestedPlayer)
    console.log('requested player', requestedPlayer.id)

    console.log('currentPlayer', currentPlayer)
    console.log('opponent player', requestedPlayer)

    const res = await axios.post(`${REACT_APP_API_URL}/play/online/`, payload)
    console.log('res', res.data.id)
    socket.emit('send-playResponse', {
      recipientId: requestedPlayer.id,
      response: true,
      gameId: res.data.id,
    })
    setState((prevState) => ({
      ...prevState,
      gameId: res.data.id,
      currentPlayer: currentPlayer,
      opponentPlayer: requestedPlayer,
    }))
    localStorage.setItem('gameId', res.data.id)
    history.push('/play')
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
    socket.on('receive-playResponse', ({ response, gameId }) => {
      console.log('response received')
      console.log('response', response)
      if (response) {
        setState((prevState) => ({ ...prevState, gameId }))
        console.log('GAME ID', gameId)
        localStorage.setItem('gameId', gameId)
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
    resetUsers,
  }

  return (
    <PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>
  )
}
