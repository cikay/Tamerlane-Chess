import { includeInTwoDimensArray, replaceAt } from './helper'
import { expandFenEmptySquares } from '../helper/Fen'
import {
  King,
  Camel,
  Catapult,
  Elephant,
  General,
  Giraffe,
  Knight,
  Vizier,
  WarEngine,
  Rook,
  PawnOfPawn,
  CamelPawn,
  CatapultPawn,
  ElephantPawn,
  GeneralPawn,
  GiraffePawn,
  KnightPawn,
  VizierPawn,
  WarEnginePawn,
  RookPawn,
  KingPawn,
} from './Pieces'
import { FEN_TYPE, COLOR } from './types'
import { positionChecker, getMoveList } from './helper'
const COLUMNS = 'abcdefghijk'.split('')

export default class TamerlaneChess {
  static #rowCount = 10
  static #lastRowIndex = 9
  static #firstRowIndex = 0
  static #colCount = 11
  static #blackColor = 'b'
  static #whiteColor = 'w'
  #board = Array.from(Array(10), () => new Array(11))
  #opponentBoard = Array.from(Array(10), () => new Array(11))
  #player = 'player'
  #opponetPlayer = 'opponent'
  #turn = TamerlaneChess.#whiteColor
  #time1 = 900
  #time2 = 900
  #storedTime1 = 0
  #storedTime2 = 0
  #winner = null
  #last = null
  #copy = true
  #ready = false
  #whiteKingCount = 1
  #blackKingCount = 1

  #playerColor
  #opponentPlayerColor
  #whiteKings = []
  #blackKings = []
  static #blackCitadel = 'y'
  static #whiteCitadel = 'x'
  #lastTakedPiece = null
  #fen
  #opponentFen
  constructor(playerColor, fen = null) {
    this.#playerColor = playerColor

    this.#opponentPlayerColor =
      this.#playerColor === TamerlaneChess.#blackColor
        ? TamerlaneChess.#blackColor
        : TamerlaneChess.#whiteColor

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 11; col++) {
        this.setPiece({ row, col }, 0)
        this.#opponentBoard[row][col] = 0
      }
    }

    //Beyaz taşlar ekranda aşağıda ise
    //  'f1d1i1i1d1f/kamzvsgzmak/pxcbyqehtnr/92/92/92/92/PXCBYQEHTNR/KAMZGSVZMAK/F1D1I1I1D1F*2 w'
    let defaultWhitePiecesAtBottomFen =
      'f1d1i1i1d1f/kamzvsgzmak/pxcbyqehtnr/92/92/92/92/PXCBEQYHTNR/KAMZGSVZMAK/F1D1I1I1D1F* w'
    //Siyah taşlar ekranda aşağıda ise
    let defaultBlackPiecesAtBottomFen =
      'F1D1I1I1D1F/KAMZVSGZMAK/PXCBYQEHTNR/92/92/92/92/pxcbyqehtnr/kamzgsvzmak/f1d1i1i1d1f* w'

    if (fen === null) {
      this.#fen =
        this.#playerColor === TamerlaneChess.#whiteColor
          ? defaultWhitePiecesAtBottomFen
          : defaultBlackPiecesAtBottomFen
    }

    this.parseFen(FEN_TYPE.player)
    this.parseFen(FEN_TYPE.opponent)
    this.printBoard()
  }

  getPiece(square){
    const position = this.squareToPosition(square)
    return this.getPieceViaPosition(position)
  }

  

  getPieceViaPosition({ row, col }) {
    console.log("try to get piece")
    console.log(`row:${row}, col:${col}`)
    return this.#board[row][col]
  }

  setPiece({ row, col }, piece) {
    this.#board[row][col] = piece
  }

  makePromotion(piece) {
    if (!piece.pawn) return
    const { row, col, color, promotedToPiece } = piece
    const conditionRow =
      this.#playerColor === color
        ? TamerlaneChess.#lastRowIndex
        : TamerlaneChess.#firstRowIndex
    console.log('condition row', conditionRow)
    if (
      conditionRow !== row ||
      (piece.constructor.name === 'PawnOfPawn' && piece.promotedCount === 3)
    ) {
      return
    }

    //opponent board will be set
    console.log('promoted to ', piece.promotedToPiece)
    console.log('piece.promotedCount ', piece.promotedCount)
    if (piece.constructor.name === 'PawnOfPawn') {
      piece.promotedCount += 1
      if (piece.promotedCount === 3) {
        const adventitiousKing = new promotedToPiece(row, col, color)
        this.setPiece({ row, col }, adventitiousKing)
        this.updateFen()
      }
    } else {
      const piece = new promotedToPiece(row, col, color)
      this.setPiece({ row, col }, piece)
    }

    console.log('piece.promotedCount ', piece.promotedCount)
    this.printBoard()
  }

  isPiecePromotedPawnOfPawn(fromSquare) {
    const piece = this.getPiece(fromSquare)
    if (
      piece !== 0 &&
      piece.constructor.name === 'PawnOfPawn' &&
      piece.promotedCount > 0
    ) {
      return true
    }
    return false
  }

  getMoves(square) {
    const { row, col } = this.squareToPosition(square)
    if (!this.isMovingPlayerInTurn(row, col)) return null
    console.log(`row:${row}, col:${col}`)
    const piece = this.getPieceViaPosition({ row, col })
    this.printBoard()
    console.log('piece', piece)
    const moveList = getMoveList(this.#board, piece, this.#playerColor)

    console.log(moveList)
    const squareList = moveList.map((pos) => {
      return this.positionToSquare(pos.row, pos.col)
    })
    return squareList
  }

  getTurn() {
    return this.#turn
  }

  gameOver() {
    return false
  }

  hasMovingPlayerPiece(row, col, movingPlayerColor) {
    console.log(`row:${row}, col:${col}`)
    const piece = this.getPieceViaPosition({ row, col })
    // if (piece && piece.color === movingPlayerColor) {
    //   return true
    // }
    return true
  }

  isMovingPlayerInTurn(row, col) {
    console.log(`row:${row}, col:${col}`)
    const piece = this.getPieceViaPosition({ row, col })
    if (piece && piece.color === this.#turn) return true
    return false
  }

  undoMove(from, to) {
    this.changePosition(to, from)
    if (this.#lastTakedPiece) {
      this.#board[to.row][to.col] = this.#lastTakedPiece
      //fen tekrar update edilecek
    }
  }

  changePiecePosition(from, to) {
    this.updateFen(from, to)
    this.#lastTakedPiece = this.#board[to.row][to.col]
    const movingPiece = this.#board[from.row][from.col]
    movingPiece.changePosition(to.row, to.col)
    this.#board[to.row][to.col] = this.#board[from.row][from.col]
    this.#board[from.row][from.col] = 0
  }

  makeMove(fromSquare, toSquare, movingPlayerColor) {
    console.log(`from:${fromSquare}, to:${toSquare}`)
    const fromPos = this.squareToPosition(fromSquare)
    const toPos = this.squareToPosition(toSquare)
    if (
      !(
        this.IsPositionInBoard(fromPos.row, fromPos.col) &&
        this.IsPositionInBoard(toPos.row, toPos.col) &&
        this.isMovingPlayerInTurn(fromPos.row, fromPos.col) &&
        this.hasMovingPlayerPiece(fromPos.row, fromPos.col, movingPlayerColor)
      )
    ) {
      return null
    }

    const piece = this.#board[fromPos.row][fromPos.col]
    const color = piece.color
    const moves = getMoveList(this.#board, piece, this.#playerColor)

    let isMoveValid = false
    //check if move is possible
    for (const { row, col } of moves) {
      if (toPos.row === row && toPos.col === col) {
        isMoveValid = true
        break
      }
    }
    console.log('is move valid')
    if (!isMoveValid) return null
    console.log('move valid')
    const checkedBefore = this.isChecked(piece)
    this.changePiecePosition(fromPos, toPos)
    //before is check or before is check and after move there is still check
    if (this.isChecked(color) || (checkedBefore && this.isChecked(color))) {
      this.undoMove(fromPos, toPos)
      return
    }
    this.printBoard()
    //move is possible
    this.makePromotion(piece)
    this.updateMoves(movingPlayerColor)

    this.#turn =
      this.#turn === TamerlaneChess.#whiteColor
        ? TamerlaneChess.#blackColor
        : TamerlaneChess.#whiteColor
    const move = { from: fromSquare, to: toSquare }
    const moveInOpponentBoard = this.computeMoveInOpponentBoard(fromPos, toPos)
    console.log('opponent move', moveInOpponentBoard)
    //saved Move always according to white player
    let savedMove
    if (this.#playerColor === COLOR.white) {
      savedMove = move
    } else {
      savedMove = moveInOpponentBoard
    }

    return {
      status: '',
      move,
      moveInOpponentBoard,
      savedMove,
    }
  }

  getCurrentFen() {
    return this.#fen
  }

  updateFen(from, to) {
    let movedPiece = this.#board[from.row][from.col]
    this.#fen = expandFenEmptySquares(this.#fen)
    let movedPieceCharIndexInFen = this.getIndexInFen(movedPiece)
    this.#fen = replaceAt(this.#fen, movedPieceCharIndexInFen, '1')
    let toSquareCharIndexInFen = this.getIndexInFen(to)
    this.#fen = replaceAt(this.#fen, toSquareCharIndexInFen, movedPiece.fenChar)
  }

  getIndexInFen({ row, col }) {
    return (9 - row) * 12 + col
  }

  //Helper functions
  squareToPosition(square) {
    console.log(square)
    console.log(`square:${square}`)
    const col = COLUMNS.indexOf(square[0])
    //square length can be 2 or 3
    const row = Number(square.replace(/^[a-k]/, '')) - 1
    console.log(`square row: ${row}, col: ${col}`)
    return { col, row }
  }
  positionToSquare(row, col) {
    const rank = row + 1
    const file = COLUMNS[col]
    const square = `${file}${rank}`
    return square
  }

  isOwnCitadel(square, movingPlayerColor) {
    const ownCitadel =
      movingPlayerColor === TamerlaneChess.#whiteColor
        ? TamerlaneChess.#whiteCitadel
        : TamerlaneChess.#blackCitadel

    if (square === ownCitadel) return true
    else return false
  }

  computeMoveInOpponentBoard(from, to) {
    from.row = TamerlaneChess.#rowCount - from.row - 1
    from.col = TamerlaneChess.#colCount - from.col - 1
    to.row = TamerlaneChess.#rowCount - to.row - 1
    to.col = TamerlaneChess.#colCount - to.colCount - 1
    return { from, to }
  }

  computeOpponentFen(fen) {
    // const lastSlahIndex = fen.lastIndexOf('/')
    // let opponentFen = ''
    // for (let i = 0; i < fen.length; i++) {
    //   if (i === lastSlahIndex) {
    //     break
    //   }
    //   opponentFen = `${fen[i]}${opponentFen}`
    // }
    // let remainStringIndex = lastSlahIndex
    // for (; remainStringIndex < fen.length; remainStringIndex++) {
    //   opponentFen = `${opponentFen}${fen[remainStringIndex]}`
    // }
    // return opponentFen
  }

  updateMoves(movingPlayerColor) {
    for (let row = 0; row < TamerlaneChess.#rowCount; row++) {
      for (let col = 0; col < TamerlaneChess.#colCount; col++) {
        console.log(`row:${row}, col:${col}`)
        const piece = this.getPieceViaPosition({ row, col })
        if (piece !== 0) {
          if (piece.pawn) piece.updateValidMoves(this.#board, movingPlayerColor)
          else piece.updateValidMoves(this.#board)
        }
      }
    }
  }

  getOpponentValues() {}

  draw(win, color) {}
  getDangerMoves(color) {}

  isChecked(color) {
    // this.updateMoves()
    // const dangerMoves = this.getDangerMoves(color)
    // const kingPositions = []
    // for (let i = 0; i < TamerlaneChess.#rowCount; i++) {
    //   for (let j = 0; j < TamerlaneChess.#colCount; j++) {
    //     const piece = this.#board[i][j]
    //     if (typeof piece === 'object' && piece.king && piece.color === color) {
    //       kingPositions.push([i, j])
    //     }
    //   }
    // }
    // //not gonna working
    // if (kingPositions.length === 1 && dangerMoves.includes(kingPositions[0])) {
    //   return true
    // }
    return false
  }

  printBoard() {
    for (let i = this.#board.length - 1; i >= 0; i--) {
      console.log(this.#board[i])
    }
  }

  checkMate(color) {}

  parseFen(fenType) {
    console.log(fenType)
    let fen
    // if (fenType === FEN_TYPE.player) {
    //   this.#board = this.#board
    //   fen = this.#fen
    // } else if (fenType === FEN_TYPE.opponent) {
    //   this.#board = this.#opponentBoard
    //   fen = this.#opponentFen
    // } else throw Error('fen type not matching')
    let fenCounter = 0
    let row = TamerlaneChess.#rowCount - 1
    let col = 0
    let king
    let piece
    while (row >= 0 && fenCounter < this.#fen.length) {
      let emptySquareCount = 0
      switch (this.#fen[fenCounter]) {
        case 'p':
          piece = new PawnOfPawn(row, col, TamerlaneChess.#blackColor)
          break
        case 'b':
          piece = new ElephantPawn(row, col, TamerlaneChess.#blackColor)
          break
        case 'c':
          piece = new CamelPawn(row, col, TamerlaneChess.#blackColor)
          break
        case 'x':
          piece = new WarEnginePawn(row, col, TamerlaneChess.#blackColor)
          break
        case 'r':
          piece = new RookPawn(row, col, TamerlaneChess.#blackColor)
          break
        case 'n':
          piece = new KnightPawn(row, col, TamerlaneChess.#blackColor)
          break
        case 't':
          piece = new CatapultPawn(row, col, TamerlaneChess.#blackColor)
          break
        case 'h':
          piece = new GiraffePawn(row, col, TamerlaneChess.#blackColor)
          break
        case 'y':
          piece = new VizierPawn(row, col, TamerlaneChess.#blackColor)
          break
        case 'q':
          piece = new KingPawn(row, col, TamerlaneChess.#blackColor)
          break
        case 'e':
          piece = new GeneralPawn(row, col, TamerlaneChess.#blackColor)
          break
        case 'f':
          console.log(this.#board)
          piece = new Elephant(row, col, TamerlaneChess.#blackColor)
          break
        case 'd':
          piece = new Camel(row, col, TamerlaneChess.#blackColor)
          break
        case 'i':
          piece = new WarEngine(row, col, TamerlaneChess.#blackColor)
          break
        case 'k':
          piece = new Rook(row, col, TamerlaneChess.#blackColor)
          break
        case 'a':
          piece = new Knight(row, col, TamerlaneChess.#blackColor)
          break
        case 'm':
          piece = new Catapult(row, col, TamerlaneChess.#blackColor)
          break
        case 'z':
          piece = new Giraffe(row, col, TamerlaneChess.#blackColor)
          break
        case 'g':
          piece = new General(row, col, TamerlaneChess.#blackColor)
          break
        case 's':
          king = new King(row, col, TamerlaneChess.#blackColor)
          this.#blackKings.push(king)
          piece = king
          break
        case 'v':
          piece = new Vizier(row, col, TamerlaneChess.#blackColor)
          break
        case 'P':
          piece = new PawnOfPawn(row, col, TamerlaneChess.#whiteColor)
          break
        case 'B':
          piece = new ElephantPawn(row, col, TamerlaneChess.#whiteColor)
          break
        case 'C':
          piece = new CamelPawn(row, col, TamerlaneChess.#whiteColor)
          break
        case 'X':
          piece = new WarEnginePawn(row, col, TamerlaneChess.#whiteColor)
          break
        case 'R':
          piece = new RookPawn(row, col, TamerlaneChess.#whiteColor)
          break
        case 'N':
          piece = new KnightPawn(row, col, TamerlaneChess.#whiteColor)
          break
        case 'T':
          piece = new CatapultPawn(row, col, TamerlaneChess.#whiteColor)
          break
        case 'H':
          piece = new GiraffePawn(row, col, TamerlaneChess.#whiteColor)
          break
        case 'Y':
          piece = new VizierPawn(row, col, TamerlaneChess.#whiteColor)
          break
        case 'Q':
          piece = new KingPawn(row, col, TamerlaneChess.#whiteColor)
          break
        case 'E':
          piece = new GeneralPawn(row, col, TamerlaneChess.#whiteColor)
          break
        case 'F':
          piece = new Elephant(row, col, TamerlaneChess.#whiteColor)
          break
        case 'D':
          piece = new Camel(row, col, TamerlaneChess.#whiteColor)
          break
        case 'I':
          piece = new WarEngine(row, col, TamerlaneChess.#whiteColor)
          break
        case 'K':
          piece = new Rook(row, col, TamerlaneChess.#whiteColor)
          break
        case 'A':
          piece = new Knight(row, col, TamerlaneChess.#whiteColor)
          break
        case 'M':
          piece = new Catapult(row, col, TamerlaneChess.#whiteColor)
          break
        case 'Z':
          piece = new Giraffe(row, col, TamerlaneChess.#whiteColor)
          break
        case 'G':
          piece = new General(row, col, TamerlaneChess.#whiteColor)
          break
        case 'S':
          king = new King(row, col, TamerlaneChess.#whiteColor)
          this.#whiteKings.push(king)
          piece = king
          break
        case 'V':
          piece = new Vizier(row, col, TamerlaneChess.#whiteColor)
          break
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          emptySquareCount = Number(this.#fen[fenCounter])
          break
        case '/':
        case ' ':
          row -= 1
          col = 0
          fenCounter++
          continue
        default:
          console.log('Fen ERROR')
          return
      }

      if (emptySquareCount === 0) {
        this.setPiece({ row, col }, piece)
        col += 1
      } else {
        for (let i = 0; i < emptySquareCount; i++) {
          col += 1
          this.setPiece({ row, col }, 0)
        }
      }

      fenCounter++
    }
  }
}
Object.assign(TamerlaneChess.prototype, positionChecker())
