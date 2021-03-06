import {
  useState,
  useEffect,
  useContext,
  createContext,
  useReducer,
} from 'react'

import Board from './Board'
import tamerlaneChessReducer, {
  initialState,
} from '../reducers/tamerlaneChessReducers'
import {
  START_GAME,
  SET_HIGHLIGHTING,
  SELECT_PIECE,
  MOVE,
  REFRESH_PAGE,
} from '../reducers/tamerlaneChessActionTypes'
import { useSocket, usePlayersContext } from '../contexts'
import axios from 'axios'
import { COLOR } from '../tamerlane-chess/types'
import Timer from '../components/Timer'
import GameFinishDialog from '../components/GameFinishDialog'
import useLocalStorage from '../hooks/useLocalStorage'
import MovesHistory from '../components/MovesHistory'
import TakedPieceList from '../components/TakedPieceList'
import { Grid } from '@material-ui/core'

export const useTamerlaneChessContext = () => useContext(TamerlaneChessContext)
const TamerlaneChessContext = createContext()
export default function TamerlaneChessBoard({
  isGameStarted,
  setIsGameStarted,
}) {
  const [state, dispatch] = useReducer(tamerlaneChessReducer, initialState)
  const socket = useSocket()
  const { currentPlayer, opponentPlayer } = usePlayersContext()
  const gameId = localStorage.getItem('gameId')
  console.log('currentPlayer', currentPlayer)
  console.log('opponentPlayer', opponentPlayer)
  console.log('Provider called')

  useEffect(async () => {
    let type
    let payload
    console.log('isGameStarted', isGameStarted)
    console.log('isGameStarted type', typeof isGameStarted)
    if (isGameStarted === true) {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/play/online/${gameId}`
      )
      console.log('refresh page')
      type = REFRESH_PAGE
      console.log('res', res)
      const currentUserId = currentPlayer.id
      console.log(currentPlayer)
      const currentPlayerColor =
        currentUserId === res.data.black_player ? COLOR.black : COLOR.white
      payload = { currentPlayerColor, fen: res.data.current_fen }
      console.log('currentPlayerColor', currentPlayerColor)
      console.log('current user id', currentUserId)
    } else {
      type = START_GAME
      payload = {
        currentPlayerColor: currentPlayer.side,
      }
      console.log('game starting')
      // setIsGameStarted(true)
    }

    dispatch({ type, payload })
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
        // ...opponentMoveSquareStyles({
        //   history: state.history,
        //   pieceSquare: state.pieceSquare,
        // }),
      }
    }, {})
    const payload = {
      highlightStyles,
    }
    dispatch({ type: SET_HIGHLIGHTING, payload })
  }

  const handleClick = async (square) => {
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
    let turn = tamerlaneChess.getTurn()
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

      console.log('move before send', move)

      let white_player
      let black_player
      if (currentPlayer.side === COLOR.white) {
        white_player = currentPlayer.id
        black_player = opponentPlayer.id
      } else {
        white_player = opponentPlayer.id
        black_player = currentPlayer.id
      }

      // console.log('socketReturnedValue', socketReturnedValue)

      const fen = tamerlaneChess.getCurrentFen()
      turn = tamerlaneChess.getTurn()
      const history = tamerlaneChess.getHistory()
      const currentPlayerTakedPieceList = tamerlaneChess.getCurrentPlayerTakedPieceList()
      const payload = {
        fen,
        turn,
        history,
        currentPlayerTakedPieceList,
      }

      dispatch({ type: MOVE, payload })
      socket.emit('send-move', {
        opponentId: opponentPlayer.id,
        move: move.moveInOpponentBoard,
        opponentLastMoveAt: new Date().getTime(),
      })
      console.log('currentPlayer', currentPlayer)
      const currentTime = new Date().getTime()
      const current_fen = tamerlaneChess.getWhiteAtBottomFen()
      axios.put(`${process.env.REACT_APP_API_URL}/play/online/${gameId}`, {
        move: move.savedMove,
        white_player,
        black_player,
        player_color: currentPlayer.side,
        current_fen,
      })
    }
  }

  useEffect(() => {
    if (socket == null) return

    socket.on('receive-move', makeOpponentMove)

    return () => socket.off('receive-move')
  }, [socket, makeOpponentMove])

  function makeOpponentMove({ move, opponentLastMoveAt }) {
    console.log('state in useEffect', state)
    console.log('move', move)
    const { tamerlaneChess } = state
    const madeMove = tamerlaneChess.makeMove(move.from, move.to)
    const opponentTakedPieceList = tamerlaneChess.getOpponentTakedPieceList()
    const fen = tamerlaneChess.getCurrentFen()
    const turn = tamerlaneChess.getTurn()
    const history = tamerlaneChess.getHistory()
    console.log('history', history)

    const squareStyles = opponentMoveSquareStyles({
      history,
      pieceSquare: state.pieceSquare,
    })
    console.log('squareStyles xxxx', squareStyles)
    const payload = {
      fen,
      turn,
      opponentLastMoveAt,
      move,
      history,
      opponentTakedPieceList,
      squareStyles,
    }

    console.log('taked piece', state.opponentTakedPieceList)
    dispatch({ type: MOVE, payload })
  }

  const value = {
    ...state,
    handleClick,
    dispatch,
  }
  console.log('opponentTakedPieceList', state.opponentTakedPieceList)
  return (
    <TamerlaneChessContext.Provider value={value}>
      <Grid container>
        <Grid item sm={12} md={8}>
          {state.winner ? <GameFinishDialog /> : <Timer />}
          <TakedPieceList pieceList={state.currentPlayerTakedPieceList} />
          <Board></Board>
          <TakedPieceList pieceList={state.opponentTakedPieceList} />
        </Grid>
        <Grid item sm={12} md={2} spacing={2}>
          <MovesHistory moves={state.history} />
        </Grid>
        <Grid item container sm={12} md={2}></Grid>
      </Grid>
    </TamerlaneChessContext.Provider>
  )
}

function opponentMoveSquareStyles({ pieceSquare, history }) {
  const { b, w } = history.length && history[history.length - 1]
  if (!w) return
  let sourceSquare
  let targetSquare

  if (w && b) {
    sourceSquare = b.from
    targetSquare = b.to
  } else {
    sourceSquare = w.from
    targetSquare = w.to
  }

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

/*


[
  {"w": {"from": "b2", "to": "a4"}, "b": {"from": "j9", "to": "k7"}},
  {"w": {"from": "c1", "to": "d4"}, "b": {"from": "h8", "to": "h7"}}, 
  {"w": {"from": "g3", "to": "g4"}}]
*/
