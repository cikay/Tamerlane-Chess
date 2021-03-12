import './board.css'
import Square from './Square'
import Piece from './Piece'
import { COLUMNS } from '../helper/Fen'
import { Grid } from '@material-ui/core'

// import TamerlaneChess from '../tamerlane-chess'
const Board = () => {
  let squareColor = 'black'
  return (
    <div id='GameBoard' direction='row'>
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
            />
          )
        })
      })}
      <Square key='x' square={'x'} squareColor={'white'} row={2} col={12} />
      <Square key='y' square={'y'} squareColor={'black'} row={8} col={0} />
    </div>
  )
}
export default Board
