const Piece = ({ pieceName }) => {
  return (
    <img
      alt='piece icon'
      src={`../pieces-image/${pieceName}.png`}
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
