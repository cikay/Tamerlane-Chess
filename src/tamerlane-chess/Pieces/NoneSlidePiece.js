import Piece from './Piece'

export default class NoneSlidePiece extends Piece {
  validMoves(board) {
    const moves = []
    let move

    for (const { rowDir, colDir } of this.constructor._directions) {
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
  }
}
