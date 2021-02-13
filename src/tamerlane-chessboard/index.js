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
import { useSocket, useSetGameContext } from '../contexts'

export const useTamerlaneChessContext = () => useContext(TamerlaneChessContext)
const TamerlaneChessContext = createContext()
export default function TamerlaneChessBoard() {
  const [state, dispatch] = useReducer(tamerlaneChessReducer, initialState)
  const socket = useSocket()
  const { currentPlayer, opponentPlayer } = useSetGameContext()
  console.log('currentPlayer', currentPlayer)
  console.log('opponentPlayer', opponentPlayer)
  console.log('Provider called')
  useEffect(() => {
    console.log('game starting')
    const payload = {
      currentPlayerColor: currentPlayer.side,
    }
    dispatch({ type: START_GAME, payload })
  }, [])

  const removeHighlightSquare = () => {
    const { pieceSquare, history } = state
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
    // console.log(
    //   'isPiecePromotedPawnOfPawn',
    //   tamerlaneChess.isPiecePromotedPawnOfPawn(state.fromSquare)
    // )
    console.log()
    console.log('clicked square', square)
    const piece = tamerlaneChess.getPiece(square)
    console.log(`clicked piece`)
    console.log(piece)
    const turn = tamerlaneChess.getTurn()
    console.log('turn', turn)
    // highlight possible moves
    if (
      !(
        state.fromSquare &&
        tamerlaneChess.isPiecePromotedPawnOfPawn(state.fromSquare)
      ) &&
      piece.color === turn
    ) {
      const moves = tamerlaneChess.getMoves(square, turn)
      console.log('posible move')
      console.log(moves)
      if (!moves) return
      const squaresToHighlight = []

      moves.forEach((move) => {
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
      console.log('state.fromSquare', state.fromSquare)
      console.log(turn)
      const move = tamerlaneChess.makeMove(state.fromSquare, square, turn)
      if (move === null) return
      const fen = tamerlaneChess.getCurrentFen()
      const payload = { fen }

      dispatch({ type: MOVE, payload })
      console.log('move before send', move)

      socket.emit('send-move', {
        opponentId: opponentPlayer.id,
        move: move.moveInOpponentBoard,
      })
    }
  }

  useEffect(() => {
    if (socket == null) return

    socket.on('receive-move', makeOpponentMove)

    return () => socket.off('receive-move')
  }, [socket, makeOpponentMove])

  function makeOpponentMove({ move }) {
    console.log('state in useEffect', state)
    console.log('move', move)
    const { tamerlaneChess } = state
    const madeMove = tamerlaneChess.makeMove(move.from, move.to)
    const fen = tamerlaneChess.getCurrentFen()
    const payload = { fen }

    dispatch({ type: MOVE, payload })
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
