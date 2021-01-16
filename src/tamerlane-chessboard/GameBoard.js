import React, { useEffect, useState, useMemo } from 'react'
import Square from './Square'
const GameBoard = () => {
  const [state, setState] = useState({
    currentPosition: '',
  })
  const hasSquarePiece = (currentPosition, square) => {
    const keys = Object.keys(currentPosition)
    return currentPosition && keys && keys.includes(square)
  }

  const setPosition = (sourceSquare, targetSquare, piece) => {
    const { currentPosition } = state
  }

  const handleClick = () => {}
  const handleDrag = () => {}
  const handleDrop = (sourceSquare, targetSquare) => {}

  const getSquareCoordinates = () => {}
  const setSquareCoordinates = () => {}

  return (
    <div id='GameBoard' onClick={handleClick}>
      {Array(10).map((_, row) => {
        
        return Array(11).map((_, col) => {
          return (
            <Square key={`${row}-${col}`}>
              {hasSquarePiece() ? <Piece></Piece> : null}
            </Square>
          )
        })
      })}
      <div className='Square rank2 file0 dark'></div>
      <div className='Square rank9 file12 light'></div>
    </div>
  )
}
export default GameBoard
