import React from 'react'
import PropTypes from 'prop-types'
import Piece from './Piece'
import { useTamerlaneChessContext } from './index'

const Square = ({ square, squareColor, row, col }) => {
  const {
    darkSquareStyle,
    lightSquareStyle,
    currentPosition,
    handleClick,
    squareStyles,
  } = useTamerlaneChessContext()

  const hasPiece = (currentPosition, square) =>
    currentPosition && Object.keys(currentPosition)?.includes(square)

  const getPieceName = (square) => {
    return currentPosition[square]
  }

  const squareStyle = () => {
    return {
      ...(squareColor === 'black' ? darkSquareStyle : lightSquareStyle),
      width: '50px',
      height: '50px',
    }
  }
  console.log('squareStyles', squareStyles)
  return (
    <div
      style={squareStyle()}
      id={square}
      onClick={() => handleClick(square)}
      className={`file${col} rank${row}`}
    >
      <div
        style={{
          ...squareStyles[square],
          ...size(),
          display: 'flex',
        }}
      >
        {hasPiece(currentPosition, square) && (
          <Piece pieceName={getPieceName(square)}></Piece>
        )}
      </div>
    </div>
  )
}

const size = () => ({
  height: '100%',
  width: '100%',
})

// Square.PropTypes = {
//   width: PropTypes.func,
//   squareColor: PropTypes.oneOf(['white', 'black']),
//   children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
//   square: PropTypes.string,
//   lightSquareStyle: PropTypes.object,
//   darkSquareStyle: PropTypes.object,
//   roughSquare: PropTypes.func,
// }

export default Square
