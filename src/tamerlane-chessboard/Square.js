import React from 'react'
import PropTypes from 'prop-types'
import Piece from './Piece'
import { useTamerlaneChessContext } from './index'
const defaultSquareStyle = (squareColor) => {
  // return {
  //   ...size(width),
  //   ...center,
  //   ...(squareColor === 'black' ? darkSquareStyle : lightSquareStyle),
  //   ...(isOver && dropSquareColor),
  // }
}

const Square = ({ square, squareColor, row, col }) => {
  const {
    darkSquareStyle,
    lightSquareStyle,
    currentPosition,
    handleClick,
  } = useTamerlaneChessContext()
  const hasPiece = (currentPosition, square) => {
    const keys = Object.keys(currentPosition)
    return currentPosition && keys && keys.includes(square)
  }
  const getPieceName = (square) => {
    return currentPosition[square]
  }

  const squareStyle =
    squareColor === 'black' ? darkSquareStyle : lightSquareStyle
  return (
    <div
      style={defaultSquareStyle()}
      id={square}
      onClick={(square) => handleClick(square)}
      className={`file${col} rank${row}`}
    >
      {hasPiece(currentPosition, square) && (
        <Piece pieceName={getPieceName(square)}></Piece>
      )}
    </div>
  )
}

// Square.PropTypes = {
//   width: PropTypes.func,
//   squareColor: PropTypes.oneOf(['white', 'black']),
//   children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
//   square: PropTypes.string,
//   lightSquareStyle: PropTypes.object,
//   darkSquareStyle: PropTypes.object,
//   roughSquare: PropTypes.func,
// }

const size = () => {
  return
}
export default Square
