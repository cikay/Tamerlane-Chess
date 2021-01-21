import { useEffect, useContext, createContext, useState, useMemo } from 'react'
import { validFen, fenToObj, validPositionObject } from './helpers'
import Board from './Board'
import TamerlaneChess from '../tamerlane-chess'
const TamerlaneChessContext = createContext()
export const useTamerlaneChessContext = () => useContext(TamerlaneChessContext)

const getPositionObject = (position) => {
  if (position === 'start') {
    return fenToObj(
      'f1d1i1i1d1f/kamzvsgzmak/pxcbyqehtnr/92/92/92/92/PXCBYQEHTNR/KAMZGSVZMAK/F1D1I1I1D1F*2 w'
    )
  }
  if (validFen(position)) return fenToObj(position)
  if (validPositionObject(position)) return position
  return {}
}

const defaultProps = {
  id: '0',
  position: '',
  pieces: {},
  width: 560,
  orientation: 'white',
  showNotation: true,
  sparePieces: false,
  draggable: true,
  undo: false,
  dropOffBoard: 'snapback',
  transitionDuration: 300,
  boardStyle: {},
  lightSquareStyle: { backgroundColor: 'rgb(240, 217, 181)' },
  darkSquareStyle: { backgroundColor: 'rgb(181, 136, 99)' },
  squareStyles: {},
  dropSquareStyle: { boxShadow: 'inset 0 0 1px 4px yellow' },
  calcWidth: () => {},
  roughSquare: () => {},
  onMouseOverSquare: () => {},
  onMouseOutSquare: () => {},
  onDrop: () => {},
  getPosition: () => {},
  onDragOverSquare: () => {},
  onSquareClick: () => {},
  onPieceClick: () => {},
  onSquareRightClick: () => {},
  allowDrag: () => true,
}
const defaultState = {
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
  // previousPositionFromProps: getPositionObject('start'),
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
  // pieces: { ...defaultPieces, ...this.props.pieces },
  // und  oMove: this.props.undo,
}

export default function TamerlaneChessBoard() {
  let game
  useEffect(() => {
    game = new TamerlaneChess()
  }, [])
  const [state, setState] = useState(defaultState)
  const removeHighlightSquare = () => {
    const { pieceSquare, history } = state
    setState((prevState) => ({
      ...prevState,
      fromSquare: '',
      squareStyles: squareStyling({ pieceSquare, history }),
    }))
  }
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
    setState((prevState) => ({
      ...prevState,
      fromSquare: sourceSquare,
      squareStyles: { ...state.squareStyles, ...highlightStyles },
    }))
  }
  const handleClick = (square) => {
    console.log('clicked square', square)
    const piece = game.getPiece(square)
    console.log(`clicked piece`)
    console.log(piece)
    const turn = game.getTurn()
    // highlight possible moves
    if (piece.color === turn) {
      const moves = game.getMoves(square)
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
      removeHighlightSquare()
      const move = game.makeMove(state.fromSquare, square)
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
