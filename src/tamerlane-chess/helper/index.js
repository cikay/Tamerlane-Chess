export function includeInTwoDimensArray(twoDimensionArray, searchigArray) {
  searchigArray = JSON.stringify(searchigArray)
  for (const array of twoDimensionArray) {
    if (JSON.stringify(array) === searchigArray) {
      return true
    }
  }
  return false
}

export const positionChecker = () => ({
  IsPositionInBoard(row, col) {
    return row < 10 && row >= 0 && col < 11 && col >= 0
  },
})

export const movesGetter = () => ({
  getMoveList(board, piece, playerColor) {
    let moveList
    if (piece.pawn) {
      moveList = piece.validMoves(board, playerColor)
    } else {
      moveList = piece.validMoves(board)
    }
    return moveList
  },
})
