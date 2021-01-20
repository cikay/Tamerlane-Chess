import Piece from './Piece'

export default class NoneSlidePiece extends Piece {
  // constructor(row, col, color) {
  //   super(row, col, color)
  // }

  validMoves(board) {
    console.log(board)
    const moves = []
    let move
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
    console.log(moves)
    return moves
  }
}
