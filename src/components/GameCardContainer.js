import React from 'react'
import { useProfileContext } from '../contexts/ProfileContext'
import GameCard from './GameCard'
export default function GameCardContainer() {
  const { games } = useProfileContext()

  return (
    <>
      {games?.map((game) => {
        return <GameCard game={game} />
      })}
    </>
  )
}
