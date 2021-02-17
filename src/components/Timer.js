import React, { useState, useEffect } from 'react'

const TIMER = {
  PAUSED: 'PAUSED',
  TICKING: 'TICKING',
}

export default function Timer() {
  const startedTime = new Date().getTime()
  const [state, setState] = useState({ minutes: 0, seconds: 5 })

  function tick() {
    setState((prevState) => ({ ...prevState, ...getTimeLeft() }))
  }

  useEffect(() => {
    let intervalId

    if (state.minutes === 0 && state.seconds === 0) {
      return
    }
    function pauseTimer(intervalId) {
      clearTimeout(intervalId)
    }

    intervalId = setTimeout(tick, 1000)

    return pauseTimer
  }, [state.seconds])

  const getTimeLeft = () => {
    console.log('setNewTime is called')

    const currentTime = new Date().getTime()
    const spentTime = currentTime - startedTime
    let spentMinutes = Math.floor((spentTime % (1000 * 60 * 60)) / (1000 * 60))
    let spentSeconds = Math.floor((spentTime % (1000 * 60)) / 1000)

    return {
      minutes: state.minutes - spentMinutes,
      seconds: state.seconds - spentSeconds,
    }
  }

  return (
    <div>
      {state.minutes}:{state.seconds}
    </div>
  )
}
