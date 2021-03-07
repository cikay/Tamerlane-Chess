import './board.css'
import Square from './Square'
import Piece from './Piece'
import { COLUMNS } from '../helper/Fen'

// import TamerlaneChess from '../tamerlane-chess'
const Board = () => {
  let squareColor = 'black'
  return (
    <div id='GameBoard'>
      {[...Array(10)].map((_, r) => {
        return [...Array(11)].map((_, c) => {
          const row = 10 - r
          const square = `${COLUMNS[c]}${row}`
          squareColor = squareColor === 'black' ? 'white' : 'black'
          return (
            <Square
              key={square}
              square={square}
              squareColor={squareColor}
              row={row}
              col={c + 1}
            ></Square>
          )
        })
      })}
      {/* <Square key='x' square={'x'}></Square>
      <Square key='y' square={'y'}></Square> */}
    </div>
  )
}
export default Board
