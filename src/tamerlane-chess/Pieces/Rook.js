import Piece from './Piece'

export default class Rook extends Piece {
  static #directions = [
    { rowDir: 1, colDir: 0 },
    { rowDir: 0, colDir: 1 },
    { rowDir: -1, colDir: 0 },
    { rowDir: 0, colDir: -1 },
  ]
  static fenChar = 'k'

  validMoves(board) {
    const moves = []
    let currentRow
    let currentCol
    let move
    for (const { rowDir, colDir } of Rook.#directions) {
      currentCol = this.col + colDir
      currentRow = this.row + rowDir
      let attackedPiece = board[currentRow][currentCol]
      while (this.IsPositionInBoard(currentRow, currentCol)) {
        attackedPiece = board[currentRow][currentCol]
        move = { row: currentRow, col: currentCol }
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
