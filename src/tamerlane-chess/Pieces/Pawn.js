import Piece from './Piece'
import { COLOR } from './types'
class Pawn extends Piece {
  constructor(row, col, color) {
    if (this.constructor === Pawn) {
      throw Error('Pawn can not be instated')
    }
    super(row, col, color)
    this.pawn = true
  }

  validMoves(board, playerColor) {
    if (playerColor !== COLOR.white && playerColor !== COLOR.black) {
      throw Error('No matching player color with black or white')
    }
    const moves = []
    let col = this.col
    let attackedPiece

    if (playerColor === this.color) {
      //UP
      row = this.row - 1
      attackedPiece = board[row][col]
      if (attackedPiece === 0) {
        moves.push({ row, col })
      }
      //RIGHT UP
      col = this.col + 1
      attackedPiece = board[row][col]
      if (attackedPiece.color !== this.color) {
        moves.push({ row, col })
      }
      //LEFT UP
      col = this.col - 1
      attackedPiece = board[row][col]
      if (attackedPiece.color !== this.color) {
        moves.push({ row, col })
      }
    }
    //no need when online
    else {
      //DOWN
      row = this.row + 1
      col = this.col
      attackedPiece = board[row][col]
      if (attackedPiece == 0) {
        moves.push({ row, col })
      }
      //RIGHT DOWN
      col = this.col + 1
      attackedPiece = board[row][col]
      if (attackedPiece.color !== this.color) {
        moves.push({ row, col })
      }
      //LEFT DOWN
      col = this.col - 1
      attackedPiece = board[row][col]
      if (attackedPiece.color !== this.color) {
        moves.push({ row, col })
      }
    }
  }
}
