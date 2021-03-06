import React from 'react'
import { useTamerlaneChessContext } from '../contexts'
import { fenToPieceCode } from '../helper/Fen'
export default function TakedPieceList({ pieceList }) {
  console.log('pieceList', pieceList)
  return (
    <>
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
    </>
  )
}
