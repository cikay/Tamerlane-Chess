import React from 'react'
import { useHistory } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { useAuthContext } from '../../../shared/contexts'
import { useProfileContext } from '../contexts/ProfileContext'

export default function GameCard({ game }) {
  const { getGameById } = useProfileContext()
  const history = useHistory()
  const { user } = useAuthContext()
  const handleClick = async () => {
    const res = await getGameById(game.id)
    history.push(`/${user.username}/games/${game.id}`)
  }
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Text>{game.opponent}</Card.Text>
        <Card.Link href='#' onClick={handleClick}>
          İncele
        </Card.Link>
        <Card.Text className='mb-2 text-muted'>{game.playedAt}</Card.Text>
      </Card.Body>
    </Card>
  )
}
