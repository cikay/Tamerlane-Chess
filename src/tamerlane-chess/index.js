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
        this.#board[row][col] = 0
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

  getPiece(square) {
    const { row, col } = this.squareToPosition(square)
    console.log(`row:${row}, col:${col}`)
    return this.#board[row][col]
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
        this.#board[row][col] = adventitiousKing
      }
    } else {
      this.#board[row][col] = new promotedToPiece(row, col, color)
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
    const piece = this.#board[row][col]
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
    const piece = this.#board[row][col]
    // if (piece && piece.color === movingPlayerColor) {
    //   return true
    // }
    return true
  }

  isMovingPlayerInTurn(row, col) {
    const piece = this.#board[row][col]
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

  select(row, col, color) {
    let changed = false
    let prev = [-1, -1]
    for (let i = 0; i < TamerlaneChess.#rowCount; i++) {
      for (let j = 0; j < TamerlaneChess.#colCount; j++) {
        if (
          typeof this.#board[i][j] === 'object' &&
          this.#board[i][j].selected
        ) {
          prev = [i, j]
        }
      }
    }

    if (
      this.#board[row][col] === 0 &&
      JSON.stringify(prev) !== JSON.stringify([-1, -1])
    ) {
      const moves = this.#board[prev[0]][prev[1]].moveList
      if (includeInTwoDimensArray(moves, [row, col])) {
        changed = this.makeMove(prev, [row, col], color)
      }
    } else {
      // if(prev)
    }
  }

  getCurrentFen() {
    return this.#fen
  }

  formatFenChar(piece) {
    let fenChar = piece.constructor.fenChar
    return piece.color === COLOR.white
      ? fenChar.toUpperCase()
      : fenChar.toLowerCase()
  }

  updateFen(from, to) {
    let movedPiece = this.#board[from.row][from.col]
    const square = this.#board[to.row][to.col]
    console.log(movedPiece)
    console.log(`moved piece char:${movedPiece.constructor.fenChar}`)
    this.#fen = this.#fen.replace(/\*.+$/, '')
    this.#fen = expandFenEmptySquares(this.#fen)
    const fenRows = this.#fen.split('/')
    console.log(fenRows)
    for (let fenRowIndex in fenRows) {
      for (let fenCharIndex in fenRows[fenRowIndex]) {
        
        if (fenRows[fenRowIndex][fenCharIndex] === movedPiece.fenChar) {
          console.log(`fenRowIndex:${fenRowIndex}`)
          if (
            9 - fenRowIndex === movedPiece.row &&
            Number(fenCharIndex) === movedPiece.col
          ) {
            console.log('updating fen')
            let movedPieceCharIndexInFen = this.getIndexInFen(movedPiece)
            console.log('movedPieceCharIndexInFen', movedPieceCharIndexInFen)
            console.log('before assign 1 to moved piece char')
            console.log(this.#fen)
            this.#fen = replaceAt(this.#fen, movedPieceCharIndexInFen, '1')
            console.log('after assign 1 to moved piece char')
            console.log(this.#fen)
            console.log('pass 2')
            let toSquareCharIndexInFen = this.getIndexInFen(to)

            this.#fen = replaceAt(
              this.#fen,
              toSquareCharIndexInFen,
              movedPiece.fenChar
            )
            return
          }
        }
      }
    }

    // const movedPieceFenCharIndex = rows[movedPiece.row][movedPiece.col]

    console.log(this.#fen)
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
        const piece = this.#board[row][col]
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
          this.#board[row][col] = new PawnOfPawn(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'b':
          this.#board[row][col] = new ElephantPawn(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'c':
          this.#board[row][col] = new CamelPawn(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'x':
          this.#board[row][col] = new WarEnginePawn(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'r':
          this.#board[row][col] = new RookPawn(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'n':
          this.#board[row][col] = new KnightPawn(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 't':
          this.#board[row][col] = new CatapultPawn(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'h':
          this.#board[row][col] = new GiraffePawn(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'y':
          this.#board[row][col] = new VizierPawn(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'q':
          this.#board[row][col] = new KingPawn(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'e':
          this.#board[row][col] = new GeneralPawn(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'f':
          console.log(this.#board)
          this.#board[row][col] = new Elephant(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'd':
          this.#board[row][col] = new Camel(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'i':
          this.#board[row][col] = new WarEngine(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'k':
          this.#board[row][col] = new Rook(row, col, TamerlaneChess.#blackColor)
          break
        case 'a':
          this.#board[row][col] = new Knight(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'm':
          this.#board[row][col] = new Catapult(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'z':
          this.#board[row][col] = new Giraffe(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'g':
          this.#board[row][col] = new General(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 's':
          king = new King(row, col, TamerlaneChess.#blackColor)
          this.#blackKings.push(king)
          this.#board[row][col] = king
          break
        case 'v':
          this.#board[row][col] = new Vizier(
            row,
            col,
            TamerlaneChess.#blackColor
          )
          break
        case 'P':
          this.#board[row][col] = new PawnOfPawn(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'B':
          this.#board[row][col] = new ElephantPawn(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'C':
          this.#board[row][col] = new CamelPawn(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'X':
          this.#board[row][col] = new WarEnginePawn(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'R':
          this.#board[row][col] = new RookPawn(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'N':
          this.#board[row][col] = new KnightPawn(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'T':
          this.#board[row][col] = new CatapultPawn(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'H':
          this.#board[row][col] = new GiraffePawn(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'Y':
          this.#board[row][col] = new VizierPawn(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'Q':
          this.#board[row][col] = new KingPawn(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'E':
          this.#board[row][col] = new GeneralPawn(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'F':
          this.#board[row][col] = new Elephant(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'D':
          this.#board[row][col] = new Camel(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'I':
          this.#board[row][col] = new WarEngine(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'K':
          this.#board[row][col] = new Rook(row, col, TamerlaneChess.#whiteColor)
          break
        case 'A':
          this.#board[row][col] = new Knight(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'M':
          this.#board[row][col] = new Catapult(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'Z':
          this.#board[row][col] = new Giraffe(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'G':
          this.#board[row][col] = new General(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
          break
        case 'S':
          king = new King(row, col, TamerlaneChess.#whiteColor)
          this.#whiteKings.push(king)
          this.#board[row][col] = king
          break
        case 'V':
          this.#board[row][col] = new Vizier(
            row,
            col,
            TamerlaneChess.#whiteColor
          )
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
      if (emptySquareCount === 0) col += 1
      else {
        for (let i = 0; i < emptySquareCount; i++) {
          col += 1
          this.#board[row][col] = 0
        }
      }

      fenCounter++
    }
  }
}
Object.assign(TamerlaneChess.prototype, positionChecker())
