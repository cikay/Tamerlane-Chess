import React from 'react'
import { Grid, Container } from '@material-ui/core'
import GameFinishDialog from './shared/components/GameFinishDialog'
import Board from './shared/components/Board'
import TakedPieceList from './shared/components/TakedPieceList'
import GameTimer from './shared/components/GameTimer'
import {
  useTamerlaneChessContext,
  TamerlaneChessProvider,
} from './shared/contexts/TamerlaneChessContext'
import withProvider from '../shared/hoc/withProvider'
function PlayGame() {
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
        {winner ? <GameFinishDialog /> : <GameTimer />}
        <Board />
        <Container style={{ marginTop: '10px', height: '20px' }}>
          <TakedPieceList pieceList={opponentTakedPieceList} />
        </Container>
      </Grid>
      <Grid item sm={12} md={3}></Grid>
    </Grid>
  )
}

export default withProvider(PlayGame, TamerlaneChessProvider)
