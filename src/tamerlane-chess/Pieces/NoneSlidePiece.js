import Piece from './Piece'

export default class NoneSlidePiece extends Piece {
  validMoves(board) {
    console.log(board)
    const moves = []
    let move
    console.log(this.directions)
    for (const direction of this.directions) {
      const { rowDir, colDir } = direction
      let curentRow = this.row + rowDir
      let currentCol = this.col + colDir
      if (
        curentRow < 10 &&
        curentRow >= 0 &&
        currentCol < 11 &&
        currentCol >= 0
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
