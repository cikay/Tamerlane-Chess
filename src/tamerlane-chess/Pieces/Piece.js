import { positionChecker } from '../helper'
import { COLOR } from '../types'
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
    // this.setFenChar()
  }

  // setFenChar() {
  //   if (this.color === COLOR.white) {
  //     console.log(this)
  //     this.constructor.fenChar = this.constructor.fenChar.toUpperCase()
  //   } else {
  //     console.log('siyah')
  //     console.log(this)
  //     this.constructor.fenChar = this.constructor.fenChar.toLowerCase()
  //     console.log(`fenChar:${this.constructor.fenChar}`)
  //   }
  // }

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
