import React from 'react'

const Piece = ({ pieceName }) => {
  console.log('pieceName', pieceName)
  return (
    <img alt='piece icon' src={`pieces-image/${pieceName}.png`} />
  )
}

export default Piece
