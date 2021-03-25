import React from 'react'
import Timer from '../containers/Timer'
import GameFinishDialog from '../containers/GameFinishDialog'
import Board from '../components/Board'
import TakedPieceList from '../components/TakedPieceList'
import { Grid, Container } from '@material-ui/core'
import { useTamerlaneChessContext } from '../contexts'
export default function PlayGame() {
  const {
    winner,
    currentPlayerTakedPieceList,
    opponentTakedPieceList,
  } = useTamerlaneChessContext()
  console.log('invoked playGame')
  return (
    <Grid container alignItems='flex-start'>
      <Grid item sm={12} md={1}></Grid>
      <Grid container item sm={12} md={7} direction='row'>
        <Container style={{ marginTop: '10px', height: '20px' }}>
          <TakedPieceList pieceList={currentPlayerTakedPieceList} />
        </Container>
        {winner ? <GameFinishDialog /> : <Timer />}
        <Board />
        <Container style={{ marginTop: '10px', height: '20px' }}>
          <TakedPieceList pieceList={opponentTakedPieceList} />
        </Container>
      </Grid>
      <Grid item sm={12} md={3}></Grid>
    </Grid>
  )
}
