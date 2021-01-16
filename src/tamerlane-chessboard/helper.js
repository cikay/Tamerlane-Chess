

function fenToPieceCode(piece){
  //white piece 
  if(piece.toLowerCase() === piece){
    return `w${piece.toUpperCase()}`
  }

  return `b${piece.toUpperCase()}`
}