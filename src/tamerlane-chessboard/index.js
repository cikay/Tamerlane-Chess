import { useEffect, useContext, createContext, useReducer } from 'react'

import Board from './Board'
import tamerlaneChessReducer, {
  initialState,
} from '../reducers/tamerlaneChessReducers'
import {
  START_GAME,
  SET_HIGHLIGHTING,
  SELECT_PIECE,
  MOVE,
} from '../reducers/tamerlaneChessActionTypes'

export const useTamerlaneChessContext = () => useContext(TamerlaneChessContext)
const TamerlaneChessContext = createContext()
export default function TamerlaneChessBoard() {
  const [state, dispatch] = useReducer(tamerlaneChessReducer, initialState)
  console.log('Provider called')
  useEffect(() => {
    dispatch({ type: START_GAME })
  }, [])
  console.log(state.squareStyles)
  const removeHighlightSquare = () => {
    const { pieceSquare, history } = state
    // setState((prevState) => ({
    //   ...prevState,
    //   fromSquare: '',
    //   squareStyles: squareStyling({ pieceSquare, history }),
    // }))
  }
  const highlightSquare = (squaresToHighlight) => {
    const highlightStyles = squaresToHighlight.reduce((a, c) => {
      return {
        ...a,
        ...{
          [c]: {
            background:
              'radial-gradient(circle, rgb(125, 226, 1) 36%, transparent 40%)',
            borderRadius: '50%',
          },
        },
        ...squareStyling({
          history: state.history,
          pieceSquare: state.pieceSquare,
        }),
      }
    }, {})
    const payload = {
      highlightStyles,
    }
    dispatch({ type: SET_HIGHLIGHTING, payload })
  }

  const handleClick = (square) => {
    const { tamerlaneChess } = state
    console.log('from square', state.fromSquare)
    console.log('clicked square', square)
    const piece = tamerlaneChess.getPiece(square)
    console.log(`clicked piece`)
    console.log(piece)
    const turn = tamerlaneChess.getTurn()

    if (piece.color !== turn && !state.fromSquare) return
    // highlight possible moves
    if (!state.fromSquare) {
      const moves = tamerlaneChess.getMoves(square)
      console.log('posible move')
      console.log(moves)
      if (moves.length === 0) return
      const squaresToHighlight = []

      moves.map((move) => {
        squaresToHighlight.push(move)
      })
      const payload = {
        fromSquare: square,
      }
      dispatch({ type: SELECT_PIECE, payload })
      highlightSquare(squaresToHighlight)
    }
    // make move
    else {
      removeHighlightSquare()
      console.log('trying to make move')
      const move = tamerlaneChess.makeMove(state.fromSquare, square)
      if (move === null) return
      const payload = { from: state.fromSquare, to: square }
      dispatch({ type: MOVE, payload })
    }
  }

  const setPosition = ({ sourceSquare, targetSquare, piece }) => {}

  const value = {
    ...state,
    handleClick,
  }
  return (
    <TamerlaneChessContext.Provider value={value}>
      <Board></Board>
    </TamerlaneChessContext.Provider>
  )
}

function squareStyling({ pieceSquare, history }) {
  const sourceSquare = history.length && history[history.length - 1].from
  const targetSquare = history.length && history[history.length - 1].to

  return {
    [pieceSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
    ...(history.length && {
      [sourceSquare]: {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      },
      [targetSquare]: {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      },
    }),
  }
}
