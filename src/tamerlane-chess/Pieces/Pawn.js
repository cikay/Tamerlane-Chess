import Piece from './Piece'
import Camel from './Camel'
import Knight from './Knight'
import General from './Catapult'
import Catapult from './Catapult'
import Vizier from './Vizier'
import WarEngine from './WarEngine'
import Rook from './Rook'
import { COLOR } from '../types'
import { Elephant } from '.'

class Pawn extends Piece {
  constructor(row, col, color) {
    super(row, col, color)
    if (this.constructor === Pawn) {
      throw Error('Pawn can not be instated')
    }

    this.pawn = true
  }

  updateValidMoves(board, playerColor) {
    this.moveList = this.validMoves(board, playerColor)
  }

  isPieceOpponent(row, col, board) {
    const attackedPiece = board[row][col]
    if (attackedPiece !== 0 && attackedPiece.color !== this.color) {
      return true
    }
    return false
  }

  validMoves(board, playerColor) {
    if (playerColor !== COLOR.white && playerColor !== COLOR.black) {
      throw Error('No matching player color with black or white')
    }
    const moves = []
    let row
    let col
    if (playerColor === this.color) {
      //UP
      col = this.col
      row = this.row + 1
      if (
        this.IsPositionInBoard(row, col) &&
        this.isSquareEmpty(row, col, board)
      ) {
        moves.push({ row, col })
      }

      //RIGHT UP
      col = this.col + 1
      if (
        this.IsPositionInBoard(row, col) &&
        this.isPieceOpponent(row, col, board)
      ) {
        moves.push({ row, col })
      }

      //LEFT UP
      col = this.col - 1
      if (
        this.IsPositionInBoard(row, col) &&
        this.isPieceOpponent(row, col, board)
      ) {
        moves.push({ row, col })
      }
    } else {
      //DOWN
      row = this.row - 1
      col = this.col
      if (
        this.IsPositionInBoard(row, col) &&
        this.isSquareEmpty(row, col, board)
      ) {
        moves.push({ row, col })
      }

      //RIGHT DOWN
      col = this.col + 1
      if (
        this.IsPositionInBoard(row, col) &&
        this.isPieceOpponent(row, col, board)
      ) {
        moves.push({ row, col })
      }
      //LEFT DOWN
      col = this.col - 1
      if (
        this.IsPositionInBoard(row, col) &&
        this.isPieceOpponent(row, col, board)
      ) {
        moves.push({ row, col })
      }
    }

    return moves
  }
}

export class PawnOfPawn extends Pawn {
  validMoves(board, playerColor) {
    //ozel durumlar kontrol edilecek
    if (true) {
      return super.validMoves(board, playerColor)
    }
  }
}

export class KingPawn extends Pawn {
  validMoves(board, playerColor) {
    //eğer
    if (true) {
      return super.validMoves(board, playerColor)
    }
  }
}

export class CamelPawn extends Pawn {
  constructor(row, col, color) {
    super(row, col, color)
    this.promotedToPiece = Camel
  }

  validMoves(board, playerColor) {
    return super.validMoves(board, playerColor)
  }
}

export class CatapultPawn extends Pawn {
  constructor(row, col, color) {
    super(row, col, color)
    this.promotedToPiece = Catapult
  }
}
export class ElephantPawn extends Pawn {
  constructor(row, col, color) {
    super(row, col, color)
    this.promotedToPiece = Elephant
  }
}
export class GeneralPawn extends Pawn {
  constructor(row, col, color) {
    super(row, col, color)
    this.promotedToPiece = General
  }
}
export class GiraffePawn extends Pawn {
  constructor(row, col, color) {
    super(row, col, color)
    this.promotedToPiece = GiraffePawn
  }
}
export class KnightPawn extends Pawn {
  constructor(row, col, color) {
    super(row, col, color)
    this.promotedToPiece = Knight
  }
}
export class RookPawn extends Pawn {
  constructor(row, col, color) {
    super(row, col, color)
    this.promotedToPiece = Rook
  }
}
export class VizierPawn extends Pawn {
  constructor(row, col, color) {
    super(row, col, color)
    this.promotedToPiece = Vizier
  }
}
export class WarEnginePawn extends Pawn {
  constructor(row, col, color) {
    super(row, col, color)
    this.promotedToPiece = WarEngine
  }
}
