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
    for (const direction of Catapult.#directions) {
      currentRow = this.row
      currentCol = this.col
      let { rowDir, colDir } = direction
      currentRow += rowDir
      currentCol += colDir
      console.log('capraz kare')
      console.log(`colDir:${colDir}, rowDir:${rowDir}`)
      console.log(`currentRow:${currentRow} ,currentCol: ${currentCol}`)
      let piece = board[currentRow][currentCol]

      if (piece !== 0) {
        continue
      }
      console.log('before increment')
      console.log(`colDir:${colDir}, rowDir:${rowDir}`)
      console.log(`currentRow:${currentRow} ,currentCol: ${currentCol}`)
      currentCol += colDir
      currentRow += rowDir
      while (this.IsPositionInBoard(currentRow, currentCol)) {
        piece = board[currentRow][currentCol]
        console.log('after ıncrement')
        console.log('calculating catapult move list')
        console.log(`colDir:${colDir}, rowDir:${rowDir}`)
        console.log(`currentRow:${currentRow} ,currentCol: ${currentCol}`)
        move = {
          row: currentRow,
          col: currentCol,
        }
        if (piece === 0) {
          moves.push(move)
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
