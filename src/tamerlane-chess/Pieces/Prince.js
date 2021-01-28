import Piece from './Piece'

import { KingDirectionsObj, NoneSlidePieceMovesObj } from '../helper'

export default class Prince extends Piece {
  constructor(row, col, color) {
    super(row, col, color)
    this.king = true
  }

  validMoves(board, playerColor) {
    //diğer durumlar kontrol edilecek
    return this.noneSlidePieceMoves(board)
  }
}

Object.assign(Prince.prototype, NoneSlidePieceMovesObj, KingDirectionsObj)
