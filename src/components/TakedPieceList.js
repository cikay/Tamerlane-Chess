import React from 'react'
import { useTamerlaneChessContext } from '../contexts'
import { fenToPieceCode } from '../helper/Fen'
import { GridList } from '@material-ui/core'

export default function TakedPieceList({ pieceList }) {
  console.log('pieceList', pieceList)
  return (
    <GridList cols={8}>
      {pieceList &&
        pieceList.map((takedPiece) => {
          console.log('takedPiece', takedPiece)
          const pieceCode = fenToPieceCode(takedPiece.fenChar)
          return (
            <img
              alt='taked piece'
              src={`pieces-image/${pieceCode}.png`}
              style={{ width: '25px', height: '25px' }}
            />
          )
        })}
    </GridList>
  )
}
