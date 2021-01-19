import React from 'react'

const Piece = ({ pieceName }) => {
  console.log('piece component called')
  return (
    <div className='muzaffer'>
      <img alt='piece icon' src={`pieces-image/${pieceName}.png`} />
    </div>
  )
}

export default Piece
