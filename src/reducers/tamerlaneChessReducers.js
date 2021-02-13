import {
  START_GAME,
  CLEAR_HIGHLIGHTING,
  SET_HIGHLIGHTING,
  MOVE,
  SELECT_PIECE,
} from './tamerlaneChessActionTypes'
import TamerlaneChess from '../tamerlane-chess'
import {
  validFen,
  fenToObj,
  validPositionObject,
  getPositionObject,
} from '../helper/Fen'
import { COLOR } from '../tamerlane-chess/types'

export const initialState = {
  fen: 'start',
  dropSquareStyle: {},
  squareStyles: {},
  lightSquareStyle: { backgroundColor: 'rgb(240, 217, 181)' },
  darkSquareStyle: { backgroundColor: 'rgb(181, 136, 99)' },
  pieceSquare: '',
  fromSquare: '',
  toSquare: '',
  selectedPiece: '',
  history: [],
  playerColor:
    parseInt(Math.random() * 10) % 2 === 0 ? COLOR.white : COLOR.black,

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
  switch (type) {
    case START_GAME:
      const { currentPlayerColor } = payload
      console.log("payload", payload)
      console.log('currentPlayerColor', currentPlayerColor)
      const currentPosition = getPositionObject('start', currentPlayerColor)
      const tamerlaneChess = new TamerlaneChess(currentPlayerColor)
      return {
        ...state,
        currentPosition,
        tamerlaneChess,
      }
    case MOVE:
      return {
        ...state,
        currentPosition: getPositionObject(payload.fen),
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
    default:
      return state
  }
}
