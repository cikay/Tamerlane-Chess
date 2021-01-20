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

const Square = (props) => {
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
    props.squareColor === 'black' ? darkSquareStyle : lightSquareStyle
  return (
    <div
      style={defaultSquareStyle()}
      id={props.square}
      onClick={(square) => handleClick(props.square)}
      className={`file${props.col} rank${props.row}`}
    >
      {hasPiece(currentPosition, props.square) && (
        <Piece pieceName={getPieceName(props.square)}></Piece>
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
