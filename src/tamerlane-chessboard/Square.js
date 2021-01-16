import React from 'react'
import PropTypes from 'prop-types'
const defaultSquareStyle = (squareColor) => {
  return {
    ...size(width),
    ...center,
    ...(squareColor === 'black' ? darkSquareStyle : lightSquareStyle),
    ...(isOver && dropSquareColor)
  }
}

const size = () => {
  return
}

const Square = (props) => {
  return <div style={defaultSquareStyle()}></div>
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
export default Square
