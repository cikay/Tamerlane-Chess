import Piece from './Piece'
import Camel from './Camel'
import Knight from './Knight'
import General from './Catapult'
import Catapult from './Catapult'
import Vizier from './Vizier'
import WarEngine from './WarEngine'
import Giraffe from './Giraffe'
import Elephant from './Elephant'
import Rook from './Rook'
import { COLOR } from '../types'

class Pawn extends Piece {
  static _diagonalColsIncrementValues = [-1, 1]
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

    const rowIncrementValue = playerColor === this.color ? 1 : -1
    row = this.row + rowIncrementValue

    //UP
    col = this.col
    if (
      this.IsPositionInBoard(row, col) &&
      this.isSquareEmpty(row, col, board)
    ) {
      moves.push({ row, col })
    }

    let colIncrementValue
    for (colIncrementValue of Pawn._diagonalColsIncrementValues) {
      col = this.col + colIncrementValue
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
  static #firstPromoted = 1
  static #secondPromoted = 2
  static #noPromoted = 0
  constructor(row, col, color) {
    super(row, col, color)
    this.promotedCount = 0
  }
  validMoves(board, playerColor) {
    let moves
    switch (this.getPromotedType(playerColor)) {
      //regular moves
      case PawnOfPawn.#noPromoted:
        moves = super.validMoves(board, playerColor)
        break
      case PawnOfPawn.#firstPromoted:
        moves = [...this.getForkMoves(board), ...this.getImmobileMoves(board, playerColor)]
      case PawnOfPawn.#secondPromoted:
        // move to pawn of king position
        break
    }

    return moves
  }

  getForkMoves(board) {
    const moves = []
    let row
    let square
    // for (row of board) {
    //   for (square of row) {
    //   }
    // }
    return moves
  }

  getImmobileMoves(board, playerColor) {
    const moves = []
    let row
    let piece
  
    for (row of board) {
      for (piece of row) {
        if (this.isOpponentPiece(piece)) {
          const opponentPieceMoves = this.getMoveList(board, piece, playerColor)
          
          if (opponentPieceMoves.length === 0) {
            let rowPos, colPos
            const rowIncerementValue = playerColor === this.color ? -1 : 1
            rowPos = piece.row + rowIncerementValue
            let colIncrementValue
            for (colIncrementValue of PawnOfPawn._diagonalColsIncrementValues) {
              colPos = piece.col + colIncrementValue
              if (this.IsPositionInBoard(rowPos, colPos)) {
                moves.push({
                  row: rowPos,
                  col: colPos,
                })
              }
            }
          }
        }
      }
    }
    return moves
  }

  getPromotedType(playerColor) {
    if (
      playerColor === this.color &&
      this.row === 9 &&
      this.promotedCount === PawnOfPawn.#firstPromoted
    ) {
      return PawnOfPawn.#firstPromoted
    } else if (
      playerColor !== this.color &&
      this.row === 0 &&
      this.promotedCount === PawnOfPawn.#secondPromoted
    ) {
      return PawnOfPawn.#secondPromoted
    }
    return PawnOfPawn.#noPromoted
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
    this.promotedToPiece = Giraffe
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
