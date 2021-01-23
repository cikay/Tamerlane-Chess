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
  currentPosition: getPositionObject('start'),
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
      const tamerlaneChess = new TamerlaneChess()
      return {
        ...state,
        tamerlaneChess,
      }
    case MOVE:
      const lastMoveStatus = state.tamerlaneChess.makeMove(payload.toSquare)
      return {
        ...state,
        lastMoveStatus,
        isGameOver: state.tamerlaneChess.gameOver(),
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
