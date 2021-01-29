import Piece from './Piece'

export default class Giraffe extends Piece {
  static #directions = [
    { rowDir: -1, colDir: 1 },
    { rowDir: 1, colDir: 1 },
    { rowDir: 1, colDir: -1 },
    { rowDir: -1, colDir: -1 },
  ]

  constructor(row, col, color) {
    super(row, col, color)
    this.fenChar = 'z'
    this.setFenChar()
  }

  validMoves(board) {
    const moves = []
    let currentCol
    let currentRow
    for (const { rowDir, colDir } of Giraffe.#directions) {
      currentCol = this.col + rowDir
      currentRow = this.row + colDir
      let piece = board[currentCol][currentRow]
    }

    return moves
  }
}
