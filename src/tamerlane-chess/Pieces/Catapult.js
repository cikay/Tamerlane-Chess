import Piece from '../Piece'

export default class Catapult extends Piece {
  #directions = [
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
    for (const direction of this.#directions) {
      let { rowDir, colDir } = direction
      currentRow += rowDir
      currentCol += colDir
      piece = board[currentRow][currentCol]

      if (piece !== 0) {
        continue
      }

      while (
        currentRow < 10 &&
        currentRow > -1 &&
        currentCol < 12 &&
        currentCol > -1
      ) {
        currentCol += colDir
        currentRow += rowDir
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
      }
    }
  }
}
