import {
  useEffect,
  useContext,
  createContext,
  useState,
  useMemo,
  useReducer,
} from 'react'

import Board from './Board'
import tamerlaneChessReducer, {
  initialState,
} from '../reducers/tamerlaneChessReducers'
import { START_GAME, SET_HIGHLIGHTING } from '../reducers/tamerlaneChessActionTypes'

export const useTamerlaneChessContext = () => useContext(TamerlaneChessContext)
const TamerlaneChessContext = createContext()
export default function TamerlaneChessBoard() {
  const [state, dispatch] = useReducer(tamerlaneChessReducer, initialState)
  console.log('Provider called')
  useEffect(() => {
    dispatch({ type: START_GAME })
  }, [])

  // const removeHighlightSquare = () => {
  //   const { pieceSquare, history } = state
  //   setState((prevState) => ({
  //     ...prevState,
  //     fromSquare: '',
  //     squareStyles: squareStyling({ pieceSquare, history }),
  //   }))
  // }

  const highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [...squaresToHighlight].reduce((a, c) => {
      return {
        ...a,
        ...{
          [c]: {
            background: 'radial-gradient(circle, #fffc00 36%, transparent 40%)',
            borderRadius: '50%',
          },
        },
        ...squareStyling({
          history: state.history,
          pieceSquare: state.pieceSquare,
        }),
      }
    }, {})
   
    dispatch({ type: SET_HIGHLIGHTING, payload: highlightStyles })
  }

  const handleClick = (square) => {
    const { tamerlaneChess } = state
    console.log('clicked square', square)
    const piece = tamerlaneChess.getPiece(square)
    console.log(`clicked piece`)
    console.log(piece)
    const turn = tamerlaneChess.getTurn()
    // highlight possible moves
    if (piece.color === turn) {
      const moves = tamerlaneChess.getMoves(square)
      console.log('posible move')
      console.log(moves)
      if (moves.length === 0) return
      const squaresToHighlight = []
      for (const move of moves) {
        squaresToHighlight.push(move)
      }
      highlightSquare(square, squaresToHighlight)
    }
    // make move
    else {
      // removeHighlightSquare()
      const move = tamerlaneChess.makeMove(state.fromSquare, square)
      if (move === null) return
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
