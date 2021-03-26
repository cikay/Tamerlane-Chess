import React from 'react'
import { useTamerlaneChessContext } from '../contexts/TamerlaneChessContext'

const Square = ({ square, squareColor, row, col, children }) => {
  const {
    darkSquareStyle,
    lightSquareStyle,
    handleClick,
    squareStyles,
  } = useTamerlaneChessContext()

  const squareStyle = () => {
    return {
      ...(squareColor === 'black' ? darkSquareStyle : lightSquareStyle),
      width: '100%',
      height: '100%',
    }
  }
  console.log('squareStyles', squareStyles)
  return (
    <div
      style={squareStyle()}
      id={square}
      onClick={() => handleClick(square)}
      className={`rank${row} file${col}`}
    >
      <div
        style={{
          ...squareStyles[square],
          height: '100%',
          width: '100%',
          display: 'flex',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Square
