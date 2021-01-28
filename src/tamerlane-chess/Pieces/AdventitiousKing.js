import Piece from './Piece'

import { KingDirectionsObj, NoneSlidePieceMovesObj } from '../helper'

export default class AdventitiousKing extends Piece {
  constructor(row, col, color) {
    super(row, col, color)
    this.king = true
  }

  validMoves(board, playerColor) {
    const ownCitadel =
      playerColor === 'w' ? { row: 1, col: 12 } : { row: 8, col: -1 }
    if (true) {
      return this.noneSlidePieceMoves(board)
    }
  }
}

Object.assign(
  AdventitiousKing.prototype,
  NoneSlidePieceMovesObj,
  KingDirectionsObj
)
