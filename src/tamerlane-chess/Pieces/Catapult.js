import Piece from './Piece'

export default class Catapult extends Piece {
  static #directions = [
    { rowDir: 1, colDir: 1 },
    { rowDir: -1, colDir: 1 },
    { rowDir: -1, colDir: -1 },
    { rowDir: 1, colDir: -1 },
  ]
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
      console.log('capraz kare')
      console.log(`colDir:${colDir}, rowDir:${rowDir}`)
      console.log(`currentRow:${currentRow} ,currentCol: ${currentCol}`)
      console.log(board)

      if (
        !this.IsPositionInBoard(currentRow, currentCol) ||
        !this.isSquareEmpty(currentRow, currentCol, board)
      ) {
        continue
      }
      let attackedPiece
      console.log('before increment')
      console.log(`colDir:${colDir}, rowDir:${rowDir}`)
      console.log(`currentRow:${currentRow} ,currentCol: ${currentCol}`)
      currentCol += colDir
      currentRow += rowDir
      while (this.IsPositionInBoard(currentRow, currentCol)) {
        attackedPiece = board[currentRow][currentCol]
        console.log('after ıncrement')
        console.log('calculating catapult move list')
        console.log(`colDir:${colDir}, rowDir:${rowDir}`)
        console.log(`currentRow:${currentRow} ,currentCol: ${currentCol}`)
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
