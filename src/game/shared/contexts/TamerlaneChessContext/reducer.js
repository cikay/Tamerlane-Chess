import {
  START_GAME,
  CLEAR_HIGHLIGHTING,
  SET_HIGHLIGHTING,
  MOVE,
  SELECT_PIECE,
  GAME_FINISH,
  REFRESH_PAGE,
} from './types'
import TamerlaneChess from '../../../../tamerlane-chess'
import { getPositionObject } from '../../../../shared/helper/Fen'
import { COLOR } from '../../../../tamerlane-chess/types'

export const initialState = {
  fen: 'start',
  dropSquareStyle: {},
  squareStyles: {},
  lightSquareStyle: { backgroundColor: 'rgb(240, 217, 181)' },
  darkSquareStyle: { backgroundColor: 'rgb(181, 136, 99)' },
  pieceSquare: '',
  fromSquare: '',
  toSquare: '',
  turn: COLOR.white,
  opponentLastMoveAt: '',
  opponentLastMove: '',
  winner: '',
  opponentTakedPieceList: '',
  currentPlayerTakedPieceList: '',
  selectedPiece: '',
  history: '',
  sourceSquare: '',
  targetSquare: '',
  sourcePiece: '',
  waitForTransition: false,
  phantomPiece: null,
  wasPieceTouched: false,
  manualDrop: false,
  squareClicked: false,
  firstMove: false,
}

export default function tamerlaneChessReducer(state = initialState, action) {
  const { type, payload } = action
  let tamerlaneChess, fen, currentPlayerColor
  switch (type) {
    case START_GAME:
      currentPlayerColor = payload.currentPlayerColor
      console.log('payload', payload)
      console.log('currentPlayerColor', currentPlayerColor)
      const currentPosition = getPositionObject('start', currentPlayerColor)
      tamerlaneChess = new TamerlaneChess(currentPlayerColor)
      return {
        ...state,
        currentPosition,
        tamerlaneChess,
      }
    case MOVE:
      const { turn, opponentLastMoveAt, opponentLastMove, history } = payload
      console.log('turn', turn)
      console.log('history', history)

      return {
        ...state,
        currentPosition: getPositionObject(payload.fen),
        ...payload,
      }
    case REFRESH_PAGE:
      console.log('payload', payload)
      console.log('payload.fen', payload.fen)
      console.log('state in refresh', state)
      tamerlaneChess = new TamerlaneChess(payload.currentPlayerColor, fen)
      fen = tamerlaneChess.getCurrentFen()
      console.log('fen', fen)
      return {
        ...state,
        tamerlaneChess,
        currentPosition: getPositionObject(fen),
        currentPlayerColor: payload.currentPlayerColor,
        turn: fen[fen.length - 1],
      }
    case CLEAR_HIGHLIGHTING:
      return {
        ...state,
      }
    case SET_HIGHLIGHTING:
      return {
        ...state,
        squareStyles: payload.highlightStyles,
      }
    case SELECT_PIECE:
      return {
        ...state,
        fromSquare: payload.fromSquare,
      }
    case GAME_FINISH:
      console.log('GAME FINISHED', payload)
      state.tamerlaneChess.finish()
      return {
        ...state,
        winner: payload.winner,
      }
    default:
      return state
  }
}
