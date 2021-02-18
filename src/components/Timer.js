import React, { useState, useEffect } from 'react'
import { usePlayersContext } from '../contexts'
import { GAME_FINISH } from '../reducers/tamerlaneChessActionTypes'
import { COLOR } from '../tamerlane-chess/types'
import { useTamerlaneChessContext } from '../tamerlane-chessboard'
import GameFinishDialog from './GameFinishDialog'

const TIMER = {
  PAUSED: 'PAUSED',
  TICKING: 'TICKING',
}

export default function Timer() {
  const { currentPlayer, opponentPlayer } = usePlayersContext()
  const { turn, winner, dispatch } = useTamerlaneChessContext()
  const startedTime = new Date().getTime()
  const [currentPlayerLeftTime, setCurrentPlayerLeftTime] = useState({
    minutes: 0,
    seconds: 5,
  })
  const [opponentPlayerLeftTime, setOpponentPlayerLeftTime] = useState({
    minutes: 0,
    seconds: 5,
  })

  function tick() {
    console.log('moveTurn', turn)
    console.log('currentPlayer', currentPlayer)
    if (turn === currentPlayer.side) {
      setCurrentPlayerLeftTime((prevState) => ({
        ...prevState,
        ...getTimeLeft(currentPlayerLeftTime),
      }))

      console.log('CurrentPlayerLeftTime', currentPlayerLeftTime)
    } else {
      console.log('opponent')
      setOpponentPlayerLeftTime((prevState) => ({
        ...prevState,
        ...getTimeLeft(opponentPlayerLeftTime),
      }))
    }
  }

  function pauseTimer(timeoutId) {
    clearTimeout(timeoutId)
  }

  useEffect(() => {
    let timeoutId
    console.log('currentPlayerLeftTime useEffect called')
    if (
      currentPlayerLeftTime.minutes === 0 &&
      currentPlayerLeftTime.seconds === 0
    ) {
      dispatch({ type: GAME_FINISH, payload: { winner: opponentPlayer.side } })
      return
    }

    timeoutId = setTimeout(tick, 1000)

    return () => pauseTimer(timeoutId)
  }, [currentPlayerLeftTime.seconds])

  useEffect(() => {
    let timeoutId
    console.log('opponentPlayerLeftTime useEffect called')
    if (
      opponentPlayerLeftTime.minutes === 0 &&
      opponentPlayerLeftTime.seconds === 0
    ) {
      dispatch({
        type: GAME_FINISH,
        payload: { winner: currentPlayer.side },
      })
      return
    }

    timeoutId = setTimeout(tick, 1000)

    return () => pauseTimer(timeoutId)
  }, [opponentPlayerLeftTime.seconds])

  const getTimeLeft = (playerLeftTime) => {
    const currentTime = new Date().getTime()
    const spentTime = currentTime - startedTime
    let spentMinutes = Math.floor((spentTime % (1000 * 60 * 60)) / (1000 * 60))
    let spentSeconds = Math.floor((spentTime % (1000 * 60)) / 1000)

    let minutes = playerLeftTime.minutes - spentMinutes
    let seconds = playerLeftTime.seconds - spentSeconds
    if (seconds === -1) {
      seconds = 59
      minutes -= 1
    }

    return {
      minutes,
      seconds,
    }
  }

  return (
    <>
      <div>
        Kalan zamanın: {currentPlayerLeftTime.minutes}:
        {currentPlayerLeftTime.seconds}
      </div>
      <div>
        Rakibinin kalan zamanı: {opponentPlayerLeftTime.minutes}:
        {opponentPlayerLeftTime.seconds}
      </div>
    </>
  )
}
