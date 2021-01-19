import Piece from './Piece'

class NoneSlidePiece extends Piece {
  
  validMoves(board) {
    const moves = []
    let move
    for (const direction of this.#directions) {
      const { rowDir, colDir } = direction
      let curentRow = this.row + rowDir
      let currentCol = this.col + colDir
      if (
        curentRow < 10 &&
        curentRow > -1 &&
        currentCol < 12 &&
        currentCol > -1
      ) {
        piece = board[curentRow][currentCol]
        move = { row: curentRow, col: currentCol }
        if (piece === 0 || piece.color !== this.color) {
          moves.push(move)
        }
      }
    }

    return moves
  }
}
