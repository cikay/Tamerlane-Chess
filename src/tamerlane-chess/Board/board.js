import { includeInTwoDimensArray } from '../helper'
import {
  Camel,
  Catapult,
  Elephant,
  General,
  Knight,
  Vizier,
  WarEngine,
} from '../Pieces'
import { FEN_TYPE, COLOR } from '../Pieces/types'

export default class TamerlaneChess {
  constructor(rows, cols, playerColor, fen = null) {
    this.rowCount = rows
    this.colCount = cols
    this.board = Array.from(Array(10), () => new Array(13))
    this.opponentBoard = Array.from(Array(10), () => new Array(13))
    this.player = 'player'
    this.opponetPlayer = 'opponent'
    this.turn = 'w'
    this.time1 = 900
    this.time2 = 900
    this.storedTime1 = 0
    this.storedTime2 = 0
    this.winner = null
    this.last = null
    this.copy = true
    this.ready = false
    this.whiteKingCount = 1
    this.blackKingCount = 1

    //player always be bottom
    this.blackColor = 'b'
    this.whiteColor = 'w'
    this.playerColor = playerColor
    this.opponentPlayerColor =
      this.playerColor === this.blackColor ? this.blackColor : this.whiteColor

    for (const row = 0; row < 10; row++) {
      for (const col = 1; col < 12; col++) {
        this.board[row][col] = 0
        this.opponentBoard[row][col] = 0
      }
    }
    //citadels square
    this.board[1][0] = 0
    this.board[8][12] = 0
    this.opponentBoard[1][0] = 0
    this.opponentBoard[8][12] = 0

    const defaultWhitePiecesAtBottomFen =
      'f1d1i1i1d1f/kamzgsvzmak1/pxcbyqehtnr/92/92/92/92/PXCBYQEHTNR/KAMZGSVZMAK1/F1D1I1I1D1F/ w'
    ////Siyah taşlar ekranda aşağıda ise
    const defaultBlackPiecesAtBottomFen =
      'F1D1I1I1D1F/KAMZGSVZMAK1/PXCBYQEHTNR/92/92/92/92/pxcbyqehtnr/kamzgsvzmak1/f1d1i1i1d1f/ w'

    if (fen === null) {
      fen =
        this.playerColor === this.whiteColor
          ? defaultWhitePiecesAtBottomFen
          : defaultBlackPiecesAtBottomFen
    }
    const opponentFen = this._computeOpponentFen(fen)
    this._parseFen(fen)
    this._parseFen(opponentFen)
  }

  _computeOpponentFen(fen) {
    const lastSlahIndex = fen.lastIndexOf('/')
    let opponentFen = ''
    for (let i = 0; i < fen.length; i++) {
      if (i === lastSlahIndex) {
        break
      }

      opponentFen = `${fen[i]}${opponentFen}`
    }
    let remainStringIndex = lastSlahIndex
    for (; remainStringIndex < fen.length; remainStringIndex++) {
      opponentFen = `${opponentFen}${fen[remainStringIndex]}`
    }

    return opponentFen
  }

  moves(square) {
    return this.board[square[0]][square[1]].validMoves()
  }

  move(from, to) {
    const color = this.board[from[0]][from[1]]
    const checkedBefore = this.isChecked(color)
    let changed = true
    let copyBoard = [...this.board]
    // if(copyBoard[from[0]][from[1]].pawn){

    // }
    const movingPiece = copyBoard[from[0]][from[1]]
    movingPiece.changePosition(to[0], to[1])
    copyBoard[to[0]][to[1]] = copyBoard[from[0]][from[1]]
    copyBoard[from[0]][from[1]] = 0
    this.board = copyBoard

    if (this.isChecked(color) || (checkedBefore && this.isChecked(color))) {
      changed = false
      copyBoard = [...this.board]
      copyBoard[to[0]][to[1]].changePosition(from[0], from[1])
      copyBoard[from[0]][from[1]] = copyBoard[to[0]][to[1]]
      copyBoard[to[0]][to[1]] = 0
      this.board = copyBoard
    } else {
      this.resetSelected()
    }
    this._updateMoves()
    if (changed) {
      this.last = [from, to]
    }
    // return changed
    //return game status
    return {
      status: '',
    }
  }

  select(row, col, color) {
    let changed = false
    let prev = [-1, -1]
    for (const i = 0; i < this.rowCount; i++) {
      for (const j = 1; j < this.colCount - 1; j++) {
        if (typeof this.board[i][j] === 'object' && this.board[i][j].selected) {
          prev = [i, j]
        }
      }
    }

    if (
      this.board[row][col] === 0 &&
      JSON.stringify(prev) !== JSON.stringify([-1, -1])
    ) {
      const moves = this.board[prev[0]][prev[1]].moveList
      if (includeInTwoDimensArray(moves, [row, col])) {
        changed = this.move(prev, [row, col], color)
      }
    } else {
      // if(prev)
    }
  }

  //Helper functions
  _updateMoves() {
    for (const row = 0; i < this.rowCount; i++) {
      for (const col = 1; j < this.colCount - 1; j++) {
        const piece = this.board[row][col]
        if (piece !== 0) {
          piece.updateValidMoves(this.board)
        }
      }
    }
  }

  _getOpponentValues() {}

  _draw(win, color) {}
  _getDangerMoves(color) {}

  _isChecked(color) {
    //şahın evindeki taşlar kontrol edilecek
    this._updateMoves()
    const dangerMoves = this.getDangerMoves(color)
    const kingPositions = []
    for (const i = 0; i < this.rowCount; i++) {
      for (const j = 1; j < this.colCount; j++) {
        const piece = this.board[i][j]
        if (typeof piece === 'object' && piece.king && piece.color === color) {
          kingPositions.push([i, j])
        }
      }
    }

    if (kingPositions.length > 1 && dangerMoves.includes(kingPositions[0])) {
      return true
    }
    return false
  }

  _resetSelected() {
    for (const i = 0; i < this.rowCount; i++) {
      for (const j = 1; j < this.colCount - 1; j++) {
        const piece = this.board[i][j]
        if (piece === 'object') {
          piece.selected = false
        }
      }
    }
  }

  _checkMate(color) {}

  _parseFens(fen, fenType) {
    let BOARD
    if (fenType === FEN_TYPE.player) BOARD = this.board
    else if (fenType === FEN_TYPE.opponent) BOARD = this.opponentBoard
    else throw Error('fen type not matching')

    let fenCounter = 0
    let row = 0
    let col = this.colCount - 1

    while (row < this.rowCount && fenCounter < fen.length) {
      let emptySquareCount = 1

      switch (fen[fenCounter]) {
        case 'p':
          BOARD[row][col] = new PawnOfPawn(row, col, this.blackColor)
          break
        case 'b':
          BOARD[row][col] = new ElephantPawn(row, col, this.blackColor)
          break
        case 'c':
          BOARD[row][col] = new CamelPawn(row, col, this.blackColor)
          break
        case 'x':
          BOARD[row][col] = new WarEnginePawn(row, col, this.blackColor)
          break
        case 'r':
          BOARD[row][col] = new RookPawn(row, col, this.blackColor)
          break
        case 'n':
          BOARD[row][col] = new KnightPawn(row, col, this.blackColor)
          break
        case 't':
          BOARD[row][col] = new CatapultPawn(rol, col, this.blackColor)
          break
        case 'h':
          BOARD[row][col] = new GiraffePawn(row, col, this.blackColor)
          break
        case 'y':
          BOARD[row][col] = new VizierPawn(row, col, this.blackColor)
          break
        case 'q':
          BOARD[row][col] = new KingPawn(row, col, this.blackColor)
          break
        case 'e':
          BOARD[row][col] = new GeneralPawn(row, col, this.blackColor)
          break
        case 'f':
          BOARD[row][col] = new Elephant(row, col, this.blackColor)
          break
        case 'd':
          BOARD[row][col] = new Camel(row, col, this.blackColor)
          break
        case 'i':
          BOARD[row][col] = new WarEngine(row, col, this.blackColor)
          break
        case 'k':
          BOARD[row][col] = new Rook(row, col, this.blackColor)
          break
        case 'a':
          BOARD[row][col] = new Knight(row, col, this.color)
          break
        case 'm':
          BOARD[row][col] = new Catapult(row, col, this.blackColor)
          break
        case 'z':
          BOARD[row][col] = new Giraffe(row, col, this.blackColor)
          break
        case 'g':
          BOARD[row][col] = new General(row, col, this.blackColor)
          break
        case 's':
          BOARD[row][col] = new King(row, col, this.blackColor)
          break
        case 'v':
          BOARD[row][col] = new Vizier(row, col, this.blackColor)
          break
        case 'P':
          BOARD[row][col] = new PawnOfPawn(row, col, this.whiteColor)
          break
        case 'B':
          BOARD[row][col] = new ElephantPawn(row, col, this.whiteColor)
          break
        case 'C':
          BOARD[row][col] = new CamelPawn(row, col, this.whiteColor)
          break
        case 'X':
          BOARD[row][col] = new WarEnginePawn(row, col, this.whiteColor)
          break
        case 'R':
          BOARD[row][col] = new RookPawn(row, col, this.whiteColor)
          break
        case 'N':
          BOARD[row][col] = new KnightPawn(row, col, this.whiteColor)
          break
        case 'T':
          BOARD[row][col] = new CatapultPawn(row, col, this.whiteColor)
          break
        case 'H':
          BOARD[row][col] = new GiraffePawn(row, col, this.whiteColor)
          break
        case 'Y':
          BOARD[row][col] = new VizierPawn(row, col, this.whiteColor)
          break
        case 'Q':
          BOARD[row][col] = new KingPawn(row, col, this.whiteColor)
          break
        case 'E':
          BOARD[row][col] = new GeneralPawn(row, col, this.whiteColor)
          break
        case 'F':
          BOARD[row][col] = new Elephant(row, col, this.whiteColor)
          break
        case 'D':
          BOARD[row][col] = new Camel(row, col, this.whiteColor)
          break
        case 'I':
          BOARD[row][col] = new WarEngine(row, col, this.whiteColor)
          break
        case 'K':
          BOARD[row][col] = new Rook(row, col, this.whiteColor)
          break
        case 'A':
          BOARD[row][col] = new Knight(row, col, this.whiteColor)
          break
        case 'M':
          BOARD[row][col] = new Catapult(row, col, this.whiteColor)
          break
        case 'Z':
          BOARD[row][col] = new Giraffe(row, col, this.whiteColor)
          break
        case 'G':
          BOARD[row][col] = new General(row, col, this.whiteColor)
          break
        case 'S':
          BOARD[row][col] = new King(row, col, this.whiteColor)
          break
        case 'V':
          BOARD[row][col] = new Vizier(row, col, this.whiteColor)
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
          emptySquareCount = Number(fen[fenCounter])
          break
        case '/':
        case ' ':
          row += 1
          col = 1
          fenCounter++
          continue
        default:
          console.log('Fen ERROR')
          return
      }

      for (i = 0; i < emptySquareCount; i++) {
        col += 1
        BOARD[row][col] = 0
      }
      fenCounter++
    }
  }
}
