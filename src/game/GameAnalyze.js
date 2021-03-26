import React from 'react'
import withProvider from '../shared/hoc/withProvider'
import { TamerlaneChessProvider } from './shared/contexts/TamerlaneChessContext'

function GameAnalyze() {
  return <div></div>
}

export default withProvider({
  Component: GameAnalyze,
  Provider: TamerlaneChessProvider,
})
