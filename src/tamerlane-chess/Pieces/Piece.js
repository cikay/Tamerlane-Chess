import { positionChecker } from '../helper'
export default class Piece {
  constructor(row, col, color) {
    if (this.constructor === Piece) {
      throw Error('Piece can not be instated')
    }
    this.row = row
    this.col = col
    this.color = color
    this.moveList = []
    this.king = false
    this.pawn = false
  }

  isSelected() {
    return this.selected
  }

  updateValidMoves(board) {
    this.moveList = this.validMoves(board)
  }

  draw(win, color) {
    // if(this.color === "w"){
    //   drawThis = W[]
    // }
  }

  isOpponentPiece(piece) {
    if (piece !== 0 && piece.color !== this.color) {
      return true
    }
    return false
  }
  isOwnPiece(piece) {
    if (piece !== 0 && piece.color === this.color) return true
    return false
  }
  isSquareEmpty(row, col, board) {
    const attackedPiece = board[row][col]
    if (attackedPiece === 0) {
      return true
    }
    return false
  }

  changePosition(row, col) {
    this.row = row
    this.col = col
  }
}

Object.assign(Piece.prototype, positionChecker())
