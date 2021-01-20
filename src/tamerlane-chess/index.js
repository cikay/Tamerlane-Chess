import { includeInTwoDimensArray } from './helper'
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
const COLUMNS = 'abcdefghijk'.split('')
export default class TamerlaneChess {
  #rowCount = 10
  #colCount = 11
  #board = Array.from(Array(10), () => new Array(11))
  #opponentBoard = Array.from(Array(10), () => new Array(11))
  #player = 'player'
  #opponetPlayer = 'opponent'
  #turn = 'w'
  #time1 = 900
  #time2 = 900
  #storedTime1 = 0
  #storedTime2 = 0
  #winner = null
  #last = null
  #copy = true
  #ready = false
  #whiteKingCount = 1
  #blackKingCount
  #blackColor = 'b'
  #whiteColor = 'w'
  #playerColor
  #opponentPlayerColor

  constructor(playerColor, fen = null) {
    this.#playerColor = playerColor
    this.#opponentPlayerColor =
      this.#playerColor === this.#blackColor
        ? this.#blackColor
        : this.#whiteColor

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 11; col++) {
        this.#board[row][col] = 0
        this.#opponentBoard[row][col] = 0
      }
    }

    console.log(this.#board)
    //Beyaz taşlar ekranda aşağıda ise
    /*
    'f1d1i1i1d1f/kamzvsgzmak/pxcbyqehtnr/92/92/92/92/PXCBYQEHTNR/KAMZGSVZMAK/F1D1I1I1D1F*2 w'
    */
    const defaultWhitePiecesAtBottomFen =
      'f1d1i1i1d1f/kamzvsgzmak/pxcbyqehtnr/92/92/92/92/PXCBEQYHTNR/KAMZGSVZMAK/F1D1I1I1D1F/ w'
    //Siyah taşlar ekranda aşağıda ise
    const defaultBlackPiecesAtBottomFen =
      'F1D1I1I1D1F/KAMZVSGZMAK/PXCBYQEHTNR/92/92/92/92/pxcbyqehtnr/kamzgsvzmak/f1d1i1i1d1f/ w'

    if (fen === null) {
      fen =
        this.#playerColor === this.#whiteColor
          ? defaultWhitePiecesAtBottomFen
          : defaultBlackPiecesAtBottomFen
    }
    const opponentFen = this.computeOpponentFen(fen)
    this.parseFen(fen, FEN_TYPE.player)
    this.parseFen(opponentFen, FEN_TYPE.opponent)
  }

  // getPiece(square) {
  //   const { row, col } = this.getSquarePosition(square)
  //   return this.#board[row][col]
  // }

  // getSquarePosition(square) {
  //   const col = COLUMNS.indexOf(square[0])
  //   //row start 0 so minus 1
  //   const row = square[1] - 1
  //   console.log(this.#board)
  //   console.log(row, col)
  //   return { col, row }
  // }

  // getMoves(square) {
  //   const { row, col } = this.getSquarePosition(square)

  //   return this.#board[row][col].validMoves()
  // }

  getTurn() {
    return this.#turn
  }

  makeMove(from, to) {
    const color = this.#board[from.row][from.to]
    const checkedBefore = this.isChecked(color)
    let changed = true
    let copyBoard = [...this.#board]
    // if(copyBoard[from.row][from.col].pawn){

    // }
    const movingPiece = copyBoard[from.row][from.col]
    movingPiece.changePosition(to.row, to.col)
    copyBoard[to.row][to.col] = copyBoard[from.row][from.col]
    copyBoard[from.row][from.col] = 0
    this.#board = copyBoard

    if (this.isChecked(color) || (checkedBefore && this.isChecked(color))) {
      changed = false
      copyBoard = [...this.#board]
      copyBoard[to.row][to.col].changePosition(from.row, from.col)
      copyBoard[from.row][from.col] = copyBoard[to.row][to.col]
      copyBoard[to.row][to.col] = 0
      this.#board = copyBoard
    } else {
      this.resetSelected()
    }
    this.updateMoves()
    if (changed) {
      this.#last = [from, to]
    }
    // return changed
    //return game status
    const move = {}
    const moveInOpponentBoard = this.computeMoveInOpponentBoard(
      move.from,
      move.to
    )
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
    for (let i = 0; i < this.#rowCount; i++) {
      for (let j = 0; j < this.#colCount; j++) {
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

  //Helper functions
  computeMoveInOpponentBoard(from, to) {
    from.row = this.#rowCount - from.row - 1
    from.col = this.#colCount - from.col - 1
    to.row = this.#rowCount - to.row - 1
    to.col = this.#colCount - to.colCount - 1
    return { from, to }
  }

  computeOpponentFen(fen) {
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

  updateMoves() {
    for (let row = 0; row < this.#rowCount; row++) {
      for (let col = 0; col < this.#colCount; col++) {
        const piece = this.#board[row][col]
        if (piece !== 0) {
          piece.updateValidMoves(this.#board)
        }
      }
    }
  }

  getOpponentValues() {}

  draw(win, color) {}
  getDangerMoves(color) {}

  isChecked(color) {
    //şahın evindeki taşlar kontrol edilecek
    this.updateMoves()
    const dangerMoves = this.getDangerMoves(color)
    const kingPositions = []
    for (let i = 0; i < this.#rowCount; i++) {
      for (let j = 0; j < this.#colCount; j++) {
        const piece = this.#board[i][j]
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

  resetSelected() {
    for (let i = 0; i < this.#rowCount; i++) {
      for (let j = 0; j < this.#colCount; j++) {
        const piece = this.#board[i][j]
        if (piece === 'object') {
          piece.selected = false
        }
      }
    }
  }

  checkMate(color) {}

  parseFen(fen, fenType) {
    let BOARD
    if (fenType === FEN_TYPE.player) BOARD = this.#board
    else if (fenType === FEN_TYPE.opponent) BOARD = this.#opponentBoard
    else throw Error('fen type not matching')
    let fenCounter = 0
    let row = 0
    let col = 0
    
    while (row < this.#rowCount && fenCounter < fen.length) {
      let emptySquareCount = 0
      switch (fen[fenCounter]) {
        case 'p':
          BOARD[row][col] = new PawnOfPawn(row, col, this.#blackColor)
          break
        case 'b':
          BOARD[row][col] = new ElephantPawn(row, col, this.#blackColor)
          break
        case 'c':
          BOARD[row][col] = new CamelPawn(row, col, this.#blackColor)
          break
        case 'x':
          BOARD[row][col] = new WarEnginePawn(row, col, this.#blackColor)
          break
        case 'r':
          BOARD[row][col] = new RookPawn(row, col, this.#blackColor)
          break
        case 'n':
          BOARD[row][col] = new KnightPawn(row, col, this.#blackColor)
          break
        case 't':
          BOARD[row][col] = new CatapultPawn(row, col, this.#blackColor)
          break
        case 'h':
          BOARD[row][col] = new GiraffePawn(row, col, this.#blackColor)
          break
        case 'y':
          BOARD[row][col] = new VizierPawn(row, col, this.#blackColor)
          break
        case 'q':
          BOARD[row][col] = new KingPawn(row, col, this.#blackColor)
          break
        case 'e':
          BOARD[row][col] = new GeneralPawn(row, col, this.#blackColor)
          break
        case 'f':
          BOARD[row][col] = new Elephant(row, col, this.#blackColor)
          break
        case 'd':
          BOARD[row][col] = new Camel(row, col, this.#blackColor)
          break
        case 'i':
          BOARD[row][col] = new WarEngine(row, col, this.#blackColor)
          break
        case 'k':
          BOARD[row][col] = new Rook(row, col, this.#blackColor)
          break
        case 'a':
          BOARD[row][col] = new Knight(row, col, this.#blackColor)
          break
        case 'm':
          BOARD[row][col] = new Catapult(row, col, this.#blackColor)
          break
        case 'z':
          BOARD[row][col] = new Giraffe(row, col, this.#blackColor)
          break
        case 'g':
          BOARD[row][col] = new General(row, col, this.#blackColor)
          break
        case 's':
          BOARD[row][col] = new King(row, col, this.#blackColor)
          break
        case 'v':
          BOARD[row][col] = new Vizier(row, col, this.#blackColor)
          break
        case 'P':
          BOARD[row][col] = new PawnOfPawn(row, col, this.#whiteColor)
          break
        case 'B':
          BOARD[row][col] = new ElephantPawn(row, col, this.#whiteColor)
          break
        case 'C':
          BOARD[row][col] = new CamelPawn(row, col, this.#whiteColor)
          break
        case 'X':
          BOARD[row][col] = new WarEnginePawn(row, col, this.#whiteColor)
          break
        case 'R':
          BOARD[row][col] = new RookPawn(row, col, this.#whiteColor)
          break
        case 'N':
          BOARD[row][col] = new KnightPawn(row, col, this.#whiteColor)
          break
        case 'T':
          BOARD[row][col] = new CatapultPawn(row, col, this.#whiteColor)
          break
        case 'H':
          BOARD[row][col] = new GiraffePawn(row, col, this.#whiteColor)
          break
        case 'Y':
          BOARD[row][col] = new VizierPawn(row, col, this.#whiteColor)
          break
        case 'Q':
          BOARD[row][col] = new KingPawn(row, col, this.#whiteColor)
          break
        case 'E':
          BOARD[row][col] = new GeneralPawn(row, col, this.#whiteColor)
          break
        case 'F':
          BOARD[row][col] = new Elephant(row, col, this.#whiteColor)
          break
        case 'D':
          BOARD[row][col] = new Camel(row, col, this.#whiteColor)
          break
        case 'I':
          BOARD[row][col] = new WarEngine(row, col, this.#whiteColor)
          break
        case 'K':
          BOARD[row][col] = new Rook(row, col, this.#whiteColor)
          break
        case 'A':
          BOARD[row][col] = new Knight(row, col, this.#whiteColor)
          break
        case 'M':
          BOARD[row][col] = new Catapult(row, col, this.#whiteColor)
          break
        case 'Z':
          BOARD[row][col] = new Giraffe(row, col, this.#whiteColor)
          break
        case 'G':
          BOARD[row][col] = new General(row, col, this.#whiteColor)
          break
        case 'S':
          BOARD[row][col] = new King(row, col, this.#whiteColor)
          break
        case 'V':
          BOARD[row][col] = new Vizier(row, col, this.#whiteColor)
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
          BOARD[row][col] = 0
        }
      }

      fenCounter++
    }
    
  }
}
