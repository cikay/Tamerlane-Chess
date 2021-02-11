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
export const KingDirectionsObj = {
  directions: [
    { rowDir: 0, colDir: 1 },
    { rowDir: -1, colDir: 1 },
    { rowDir: -1, colDir: 0 },
    { rowDir: -1, colDir: -1 },
    { rowDir: 0, colDir: -1 },
    { rowDir: 1, colDir: -1 },
    { rowDir: 1, colDir: 0 },
    { rowDir: 1, colDir: 1 },
  ],
}

export const NoneSlidePieceMovesObj = {
  noneSlidePieceMoves(board) {
    const moves = []
    let move
    for (const { rowDir, colDir } of this.directions) {
      let curentRow = this.row + rowDir
      let currentCol = this.col + colDir
      if (this.IsPositionInBoard(curentRow, currentCol)) {
        const piece = board[curentRow][currentCol]
        move = { row: curentRow, col: currentCol }
        if (piece === 0 || piece.color !== this.color) {
          moves.push(move)
        }
      }
    }
    return moves
  },
}

export function getMoveList(board, piece, playerColor) {
  let moveList

  if (piece.pawn || piece.king) {
    moveList = piece.validMoves(board, playerColor)
  } else {
    moveList = piece.validMoves(board)
  }
  return moveList
}

export class SuperArray extends Array {
  static getUniqueItemContextArray(array) {
    let isUnique = true
    let i
    const uniqueObjectContextArray = [array[0]]
    for (i = 1; i < array.length; i++) {
      const obj = array[i]
      isUnique = true
      for (let j = 0; j < uniqueObjectContextArray.length; j++) {
        const uniqueObj = uniqueObjectContextArray[j]

        if (JSON.stringify(obj) === JSON.stringify(uniqueObj)) {
          isUnique = false
          break
        }
      }
      if (isUnique) {
        uniqueObjectContextArray.push(obj)
      }
    }
    return uniqueObjectContextArray
  }
}

export function replaceAt(str, index, replacement) {
  return (
    str.substring(0, index) + replacement + str.substring(index + 1)
  )
}

