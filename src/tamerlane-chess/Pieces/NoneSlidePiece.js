import Piece from './Piece'

export default class NoneSlidePiece extends Piece {
  // constructor(row, col, color) {
  //   super(row, col, color)
  // }

  validMoves(board) {
    const moves = []
    let move
    for (const direction of this.directions) {
      const { rowDir, colDir } = direction
      let curentRow = this.row + rowDir
      let currentCol = this.col + colDir
      if (
        curentRow < 10 &&
        curentRow > -1 &&
        currentCol < 12 &&
        currentCol > -1
      ) {
        const piece = board[curentRow][currentCol]
        move = { row: curentRow, col: currentCol }
        if (piece === 0 || piece.color !== this.color) {
          moves.push(move)
        }
      }
    }

    return moves
  }
}
