import Piece from './Piece'

export default class Catapult extends Piece {
  static #directions = [
    { rowDir: -1, colDir: 1 },
    { rowDir: 1, colDir: 1 },
    { rowDir: 1, colDir: -1 },
    { rowDir: -1, colDir: -1 },
  ]
  // constructor(row, col, color) {
  //   super(row, col, color)
  // }

  validMoves(board) {
    const moves = []
    let currentRow = this.row
    let currentCol = this.col
    let move
    for (const direction of Catapult.#directions) {
      let { rowDir, colDir } = direction
      currentRow += rowDir
      currentCol += colDir
      console.log(`current row:${currentRow}, currentCol:${currentCol}`)
      let piece = board[currentRow][currentCol]

      if (piece !== 0) {
        continue
      }
      currentCol += colDir
      currentRow += rowDir
      while (
        currentRow < 10 &&
        currentRow > -1 &&
        currentCol < 12 &&
        currentCol > -1
      ) {
        piece = board[currentRow][currentCol]
        move = {
          row: currentRow,
          col: currentCol,
        }
        if (piece === 0) {
          move.push(move)
        } else if (piece.color !== this.color) {
          moves.push(move)
          break
        } else {
          break
        }
        currentCol += colDir
        currentRow += rowDir
      }
    }
    return moves
  }
}
