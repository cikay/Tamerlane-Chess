import King from './King'

export default class AdventitiousKing extends King {
  constructor(row, col, color) {
    super(row, col, color)
    this.king = true
  }

  validMoves(board, playerColor) {
    const ownCitadel =
      playerColor === 'w' ? { row: 1, col: 12 } : { row: 8, col: -1 }
    if (true) {
      return super.validMoves(board, playerColor)
    }
  }
}
