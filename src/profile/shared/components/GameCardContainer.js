import React from 'react'
import GameCard from './GameCard'
import { useProfileContext } from '../contexts/ProfileContext'

export default function GameCardContainer() {
  const { games } = useProfileContext()

  return (
    <>
      profile page
      {games?.map((game) => {
        return <GameCard game={game} />
      })}
    </>
  )
}


