import Piece from './Piece'

export default class Catapult extends Piece {
  static #directions = [
    { rowDir: 1, colDir: 1 },
    { rowDir: -1, colDir: 1 },
    { rowDir: -1, colDir: -1 },
    { rowDir: 1, colDir: -1 },
  ]
  static fenChar = 'm'
  // constructor(row, col, color) {
  //   super(row, col, color)
  // }

  validMoves(board) {
    const moves = []
    let currentRow
    let currentCol
    let move
    for (const { rowDir, colDir } of Catapult.#directions) {
      currentRow = this.row + rowDir
      currentCol = this.col + colDir

      if (
        !this.IsPositionInBoard(currentRow, currentCol) ||
        !this.isSquareEmpty(currentRow, currentCol, board)
      ) {
        continue
      }
      let attackedPiece
      currentCol += colDir
      currentRow += rowDir
      while (this.IsPositionInBoard(currentRow, currentCol)) {
        attackedPiece = board[currentRow][currentCol]
        move = {
          row: currentRow,
          col: currentCol,
        }
        if (this.isOpponentPiece(attackedPiece)) {
          moves.push(move)
          break
        } else if (this.isOwnPiece(attackedPiece)) {
          break
        }
        moves.push(move)
        currentCol += colDir
        currentRow += rowDir
      }
    }
    return moves
  }
}
