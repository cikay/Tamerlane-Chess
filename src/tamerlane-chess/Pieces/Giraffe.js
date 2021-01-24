import Piece from './Piece'

export default class Giraffe extends Piece {
  static #directions = [
    { rowDir: -1, colDir: 1 },
    { rowDir: 1, colDir: 1 },
    { rowDir: 1, colDir: -1 },
    { rowDir: -1, colDir: -1 },
  ]

  validMoves(board) {
    
    const moves = [] 
    let currentCol = this.col
    let currentRow = this.row
    for (const {rowDir, colDir}  of Giraffe.#directions) {
      currentCol += rowDir
      currentRow += colDir
      let piece = board[currentCol][currentRow]
    }

    return moves
  }
}
