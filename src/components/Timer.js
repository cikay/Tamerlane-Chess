import React, { useState, useEffect } from 'react'
const sure = 3
export default function Timer() {
  const [timer, setTimer] = useState

  useEffect(() => {
    const timerId = setInternal(() => {
      setTimer(() => timer - 1)
    }, 1000)

    return () => clearInterval(timerId)
  }, [timer])

  return <div>{timer}</div>
}
