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

  changePosition(row, col) {
    this.row = row
    this.column = col
  }
}

Object.assign(Piece.prototype, positionChecker())
