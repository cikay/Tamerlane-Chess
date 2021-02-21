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
import { FEN_TYPE } from './types'
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
  #whitePieces
  #blackPieces
  #isFinished = false
  #history = []

  constructor(playerColor, fen = null) {
    this.#playerColor = playerColor

    this.#opponentPlayerColor =
      this.#playerColor === TamerlaneChess.#blackColor
        ? TamerlaneChess.#blackColor
        : TamerlaneChess.#whiteColor

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 11; col++) {
        this.setPieceToBoard({ row, col }, 0)
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
    } else {
      this.#fen = fen
    }
    this.#fen = expandFenEmptySquares(this.#fen)
    this.parseFen(FEN_TYPE.player)
    // this.parseFen(FEN_TYPE.opponent)
    this.#whitePieces = this.getActivePiece(TamerlaneChess.#whiteColor)
    this.#blackPieces = this.getActivePiece(TamerlaneChess.#blackColor)
    // this.printBoard()
  }

  getActivePiece(color) {
    const pieceList = []
    let row, col
    for (row = 0; row < TamerlaneChess.#rowCount; row++) {
      for (col = 0; col < TamerlaneChess.#colCount; col++) {
        const piece = this.getPiece({ row, col })
        if (piece.color === color) {
          pieceList.push(piece)
        }
      }
    }

    return pieceList
  }

  getPiece(position) {
    if (typeof position === 'string') {
      const { row, col } = this.squareToPosition(position)
      return this.#board[row][col]
    } else if (typeof position === 'object') {
      const { row, col } = position

      if (position.hasOwnProperty('row') && position.hasOwnProperty('col')) {
        return this.#board[row][col]
      } else {
        throw Error('Position object must have row and col properties')
      }
    } else {
      throw Error('Position type must be string or object')
    }
  }

  setPieceToBoard({ row, col }, piece) {
    this.#board[row][col] = piece
  }

  isPromoted(piece) {
    if (!piece.pawn) return false
    const { row, col, color, promotedToPiece } = piece
    const conditionRow =
      this.#playerColor === color
        ? TamerlaneChess.#lastRowIndex
        : TamerlaneChess.#firstRowIndex
    console.log('condition row', conditionRow)
    console.log('piece row', row)
    if (conditionRow === row + 1) {
      return true
    }
    return false
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
    console.log('piece.promotedCount ', piece.promotedCount)
    if (piece.constructor.name === 'PawnOfPawn') {
      piece.promotedCount += 1
      if (piece.promotedCount === 3) {
        const adventitiousKing = new promotedToPiece(row, col, color)
        this.setPieceToBoard({ row, col }, adventitiousKing)
        this.setPieceToList(adventitiousKing)
        this.updateFenToPromotedPiece({ row, col }, adventitiousKing.fenChar)
        this.setKing(adventitiousKing)
      }
    } else {
      const piece = new promotedToPiece(row, col, color)
      this.setPieceToBoard({ row, col }, piece)
      this.setPieceToList(piece)
      this.updateFenToPromotedPiece({ row, col }, piece.fenChar)
      if (piece.constructor.name === 'Prince') {
        this.setKing(piece)
      }
    }

    console.log('piece.promotedCount ', piece.promotedCount)
    // this.printBoard()
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

  getMoves(square, movingPlayerColor) {
    if (this.isFinished()) return null
    const { row, col } = this.squareToPosition(square)
    if (!this.isMovingPlayerInTurn(row, col)) return null
    console.log(`row:${row}, col:${col}`)
    const piece = this.getPiece({ row, col })
    // this.printBoard()
    console.log('piece', piece)
    let moveList
    console.log(moveList)
    let squareList
    const kings = this.getKings(piece.color)
    if (kings.length === 1) {
      console.log('kings length 1')
      moveList = this.getSafeMoves(piece, movingPlayerColor)
    } else {
      console.log('multiple king')
      moveList = getMoveList(this.#board, piece, this.#playerColor)
    }

    squareList = moveList.map((move) => {
      return this.positionToSquare(move.row, move.col)
    })
    if (piece.color === TamerlaneChess.#whiteColor) {
      console.log(this.#whiteKings)
    } else {
      console.log(this.#blackKings)
    }
    return squareList
  }

  getKings(color) {
    return color === TamerlaneChess.#whiteColor
      ? this.#whiteKings
      : this.#blackKings
  }

  getPlayerPieces(color) {
    return color === TamerlaneChess.#whiteColor
      ? this.#whitePieces
      : this.#blackPieces
  }

  getSafeMoves(piece, movingPlayerColor) {
    let fakeTakedPiece
    const safeMoves = []
    const opponentColor =
      movingPlayerColor === TamerlaneChess.#whiteColor
        ? TamerlaneChess.#blackColor
        : TamerlaneChess.#whiteColor
    const moves = getMoveList(this.#board, piece, this.#playerColor)
    for (const move of moves) {
      const from = { row: piece.row, col: piece.col }
      fakeTakedPiece = this.getPiece(move)
      console.log('before remove piece from list')
      console.log(this.getPlayerPieceList(opponentColor))
      this.removePieceFromList(fakeTakedPiece)
      this.changePiecePosition(from, move)
      console.log('updating opponent player moves')
      this.updatePlayerMoves(movingPlayerColor)
      console.log('after remove piece from list')
      console.log(this.getPlayerPieceList(opponentColor))
      const king = this.getSingleKing(piece.color)
      console.log('king', king)
      if (
        !this.isSquareInAttacked({ row: king.row, col: king.col }, piece.color)
      ) {
        safeMoves.push(move)
      }
      this.changePiecePosition(move, from)
      this.setTakedPiece(fakeTakedPiece)
    }
    this.updatePlayerMoves(movingPlayerColor)
    return safeMoves
  }

  removePieceFromList(piece) {
    if (piece === 0) return
    if (piece.color === TamerlaneChess.#whiteColor) {
      console.log('taked piece', piece)
      this.#whitePieces = [...this.#whitePieces].filter(
        (pce) => JSON.stringify(pce) !== JSON.stringify(piece)
      )
      console.log('white pieces in this')
      console.log(this.#whitePieces)
    } else {
      console.log('taked piece', piece)
      this.#blackPieces = [...this.#blackPieces].filter(
        (pce) => JSON.stringify(pce) !== JSON.stringify(piece)
      )
      console.log('black pieces in this')
      console.log(this.#blackPieces)
    }
  }

  removeKing(piece) {
    console.log('removing king', piece)
    if (piece.color === TamerlaneChess.#whiteColor) {
      console.log('king removed', piece)
      this.#whiteKings = [...this.#whiteKings].filter(
        (king) => JSON.stringify(king) !== JSON.stringify(piece)
      )
      console.log('white kings', this.#whiteKings)
    } else {
      this.#blackKings = [...this.#blackKings].filter(
        (king) => JSON.stringify(king) !== JSON.stringify(piece)
      )
    }
  }

  setTakedPiece(piece) {
    if (piece === 0) return
    this.setPieceToBoard({ row: piece.row, col: piece.col }, piece)
    this.setPieceToList(piece)
  }

  getPlayerPieceList(color) {
    return color === TamerlaneChess.#whiteColor
      ? this.#whitePieces
      : this.#blackPieces
  }

  getSingleKing(color) {
    return color === TamerlaneChess.#whiteColor
      ? this.#whiteKings[0]
      : this.#blackKings[0]
  }

  isSquareInAttacked(square, color) {
    const opponentPieces =
      color === TamerlaneChess.#whiteColor
        ? this.getPlayerPieces(TamerlaneChess.#blackColor)
        : this.getPlayerPieces(TamerlaneChess.#whiteColor)
    for (const piece of opponentPieces) {
      for (const move of piece.moveList) {
        if (move.row === square.row && move.col === square.col) {
          return true
        }
      }
    }
    return false
  }

  getTurn() {
    return this.#turn
  }

  gameOver() {
    return false
  }

  hasMovingPlayerPiece(row, col, movingPlayerColor) {
    console.log(`row:${row}, col:${col}`)
    const piece = this.getPiece({ row, col })
    // if (piece && piece.color === movingPlayerColor) {
    //   return true
    // }
    return true
  }

  isMovingPlayerInTurn(row, col) {
    console.log(`row:${row}, col:${col}`)
    const piece = this.getPiece({ row, col })
    if (piece && piece.color === this.#turn) return true
    return false
  }

  undoMove(from, to, takedPiece) {
    this.changePiecePosition(to, from)
    this.setTakedPiece(takedPiece)
    if (takedPiece.king) {
      this.setKing(takedPiece)
    }
  }

  changePiecePosition(from, to) {
    // this.updateFen(from, to)
    this.#lastTakedPiece = this.#board[to.row][to.col]
    const movingPiece = this.#board[from.row][from.col]
    movingPiece.changePosition(to.row, to.col)
    this.#board[to.row][to.col] = this.#board[from.row][from.col]
    this.#board[from.row][from.col] = 0
  }

  makeTemporaryMove(from, to) {
    this.changePiecePosition(from, to)
  }

  undoTemporaryMove(from, to) {}

  makeMove(fromSquare, toSquare, movingPlayerColor) {
    if (this.isFinished()) return null
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

    const takedPiece = this.getPiece(toPos)
    this.changePiecePosition(fromPos, toPos)
    this.removePieceFromList(takedPiece)
    if (takedPiece.king) {
      console.log('try to remove king')
      this.removeKing(takedPiece)
    }
    if (this.isChecked(piece.color)) {
      this.undoMove(fromPos, toPos, takedPiece)
      return
    }
    // this.printBoard()
    //move is possible
    this.updateFen(fromPos, toPos, piece.fenChar)
    this.makePromotion(piece)
    this.updateMoves(movingPlayerColor)
    this.setHistory(fromSquare, toSquare)
    console.log('history', this.#history)

    this.#turn =
      this.#turn === TamerlaneChess.#whiteColor
        ? TamerlaneChess.#blackColor
        : TamerlaneChess.#whiteColor
    const move = { from: fromSquare, to: toSquare }
    const moveInOpponentBoard = this.computeMoveInOpponentBoard(fromPos, toPos)
    console.log('opponent move', moveInOpponentBoard)
    //saved Move always according to white player
    let savedMove
    if (this.#playerColor === TamerlaneChess.#whiteColor) {
      savedMove = move
    } else {
      savedMove = moveInOpponentBoard
    }
    if (takedPiece.king) {
      if (takedPiece.color === TamerlaneChess.#whiteColor) {
        console.log(this.#whiteKings)
      } else {
        console.log(this.#blackKings)
      }
    }

    return {
      status: '',
      move,
      moveInOpponentBoard,
      savedMove,
    }
  }

  setHistory(fromSquare, toSquare) {
    if (this.#turn === TamerlaneChess.#whiteColor) {
      this.#history.push({ [this.#turn]: { from: fromSquare, to: toSquare } })
    } else {
      const lastMove = this.#history[this.#history.length - 1]
      lastMove[this.#turn] = { from: fromSquare, to: toSquare }
    }
  }

  getHistory() {
    return this.#history
  }

  getCurrentFen() {
    return this.#fen
  }

  isSwitched() {
    return false
  }

  updateFenToPromotedPiece(promotedPiecePosition, promotedPieceFenChar) {
    const movedPieceCharIndexInFen = this.getIndexInFen(promotedPiecePosition)
    this.replacePieceFenCharAt(movedPieceCharIndexInFen, promotedPieceFenChar)
  }

  updateFen(from, to, movedPieceFenChar) {
    //position already chaged so from is to, to is from
    const newTo = from
    const newFrom = to
    const movedPiece = this.getPiece(newFrom)
    console.log('moved piece', movedPiece)
    const movedPieceCharIndexInFen = this.getIndexInFen(movedPiece)
    const toSquareCharIndexInFen = this.getIndexInFen(newTo)
    this.replacePieceFenCharAt(movedPieceCharIndexInFen, movedPieceFenChar)
    this.replacePieceFenCharAt(toSquareCharIndexInFen, '1')
  }

  replacePieceFenCharAt(charIndex, pieceFenChar) {
    this.#fen = replaceAt(this.#fen, charIndex, pieceFenChar)
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
    console.log('computeMoveInOpponentBoard')
    console.log('from')
    console.log(from)
    console.log('to')
    console.log(to)
    from.row = TamerlaneChess.#rowCount - from.row - 1
    from.col = TamerlaneChess.#colCount - from.col - 1
    to.row = TamerlaneChess.#rowCount - to.row - 1
    to.col = TamerlaneChess.#colCount - to.col - 1
    const toSquare = this.positionToSquare(to.row, to.col)
    const fromSquare = this.positionToSquare(from.row, from.col)
    return { from: fromSquare, to: toSquare }
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
    this.updatePlayerMoves(movingPlayerColor)
    this.updatePlayerMoves(movingPlayerColor)
  }

  updatePlayerMoves(movingPlayerColor) {
    const opponentPlayerColor =
      movingPlayerColor === TamerlaneChess.#whiteColor
        ? TamerlaneChess.#blackColor
        : TamerlaneChess.#whiteColor
    console.log('moving playerColor', movingPlayerColor)
    const pieces =
      opponentPlayerColor === TamerlaneChess.#whiteColor
        ? this.#whitePieces
        : this.#blackPieces
    let piece
    for (piece of pieces) {
      if (piece.pawn) piece.updateValidMoves(this.#board, this.#playerColor)
      else piece.updateValidMoves(this.#board)
    }
  }

  setPieceToList(piece) {
    if (piece.color === TamerlaneChess.#whiteColor) {
      this.#whitePieces.push(piece)
    } else if (piece.color === TamerlaneChess.#blackColor) {
      this.#blackPieces.push(piece)
    }
  }

  getOpponentValues() {}

  draw(win, color) {}
  setKing(king) {
    console.log('king setting', king)
    if (king.color === TamerlaneChess.#whiteColor) {
      this.#whiteKings.push(king)
    } else {
      this.#blackKings.push(king)
    }
  }

  getDangerMoves(color) {
    const kings =
      color === TamerlaneChess.#whiteColor ? this.#whiteKings : this.#blackKings

    if (kings.length === 1) {
      const pieces =
        color === TamerlaneChess.#whiteColor
          ? this.#blackPieces
          : this.#whitePieces
      let piece, move
      for (piece of pieces) {
        for (move of piece.moveList) {
          if (move.row === kings[0].row && move.col === kings[0].col) {
          }
        }
      }
    }
  }

  isChecked(color) {
    console.log('updating move in isChecked func')
    this.updateMoves(color)

    const kings =
      color === TamerlaneChess.#whiteColor ? this.#whiteKings : this.#blackKings
    console.log('kings', kings)
    console.log('white kings', this.#whiteKings)
    console.log('black kings', this.#blackKings)
    if (kings.length === 1) {
      const pieces =
        color === TamerlaneChess.#whiteColor
          ? this.#blackPieces
          : this.#whitePieces
      let piece, move
      const singleKing = kings[0]
      console.log(pieces)
      for (piece of pieces) {
        for (move of piece.moveList) {
          if (move.row === singleKing.row && move.col === singleKing.col) {
            console.log('checked')
            return true
          }
        }
      }
    }
    return false
  }

  isSingleKingIndangerMoves() {}

  printBoard() {
    for (let i = this.#board.length - 1; i >= 0; i--) {
      console.log(this.#board[i])
    }
  }

  finish() {
    this.#isFinished = true
  }

  isFinished() {
    return this.#isFinished
  }

  checkMate(color) {}

  parseFen(fenType) {
    console.log(fenType)
    let fen

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
          this.setKing(king)
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
          piece = new King(row, col, TamerlaneChess.#whiteColor)
          this.setKing(piece)
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
          console.log(this.#fen[fenCounter])
          console.log('Fen finished')
          return
      }

      if (emptySquareCount === 0) {
        this.setPieceToBoard({ row, col }, piece)
        col += 1
      } else {
        for (let i = 0; i < emptySquareCount; i++) {
          col += 1
          this.setPieceToBoard({ row, col }, 0)
        }
      }

      fenCounter++
    }
  }
}
Object.assign(TamerlaneChess.prototype, positionChecker())
