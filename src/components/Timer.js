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
let lastOpponentMove
export default function Timer() {
  const { currentPlayer, opponentPlayer } = usePlayersContext()
  const {
    turn,
    dispatch,
    opponentLastMoveAt,
    history,
  } = useTamerlaneChessContext()

  const [zamanFarkı, setZamanFarkı] = useState({
    currentPlayerZaman: [],
    opponentPlayerZaman: [],
  })

  const startedTime = new Date().getTime()

  let delay = 0

  if (history.length !== 0 && turn === currentPlayer.side) {
    lastOpponentMove = history[history.length - 1][opponentPlayer.side]
  }

  useEffect(() => {
    console.log('startedTime', startedTime)
    console.log('opponentLastMoveAt', opponentLastMoveAt)
    console.log('lastOpponentMove', lastOpponentMove)
    if (history.length !== 0) {
      delay = startedTime - opponentLastMoveAt
    }

    console.log('delay', delay)
  }, [JSON.stringify(lastOpponentMove)])

  const time = {
    minutes: 10,
    seconds: 0,
  }

  const [currentPlayerLeftTime, setCurrentPlayerLeftTime] = useState({
    ...time,
  })
  const [opponentPlayerLeftTime, setOpponentPlayerLeftTime] = useState({
    ...time,
  })

  function tick() {
    if (turn === currentPlayer.side) {
      setCurrentPlayerLeftTime((prevState) => ({
        ...prevState,
        ...getTimeLeft(currentPlayerLeftTime),
      }))
    } else {
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

    if (
      currentPlayerLeftTime.minutes === 0 &&
      currentPlayerLeftTime.seconds === 0
    ) {
      dispatch({ type: GAME_FINISH, payload: { winner: opponentPlayer.side } })
      return
    }

    timeoutId = setTimeout(tick, 1000 - delay)

    return () => pauseTimer(timeoutId)
  }, [currentPlayerLeftTime.seconds])

  useEffect(() => {
    let timeoutId

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

    timeoutId = setTimeout(tick, 1000 + delay)

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

function getOpponentLastMove(history, opponentPlayerColor) {
  if (opponentPlayerColor === COLOR.white) {
    const lastMove = history[history.length - 1]
    return lastMove[opponentPlayerColor]
  } else {
    const previousLastMove = history[history.length - 2]
    return previousLastMove[opponentPlayerColor]
  }
}
