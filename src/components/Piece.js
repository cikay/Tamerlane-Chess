import React from 'react'

const Piece = ({ pieceName }) => {
  return (
    <img
      alt='piece icon'
      src={`play/online/pieces-image/${pieceName}.png`}
      style={{
        display: 'block',
        height: '80%',
        width: '80%',
        margin: 'auto',
      }}
    />
  )
}

export default Piece
