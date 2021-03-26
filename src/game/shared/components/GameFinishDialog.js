import { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { usePlayersContext } from '../../../shared/contexts/PlayersContext'
import { useTamerlaneChessContext } from '../contexts/TamerlaneChessContext'

export default function GameFinishDialog() {
  const { currentPlayer, opponentPlayer } = usePlayersContext()
  const { winner } = useTamerlaneChessContext()
  const [show, setShow] = useState(true)

  function getMessage() {
    if (winner === currentPlayer.side) {
      return 'Kazandınız'
    } else {
      const winnerColorFullname =
        opponentPlayer.side === 'w' ? 'Beyaz' : 'Siyah'
      return `${winnerColorFullname} Kazandı!`
    }
  }

  const handleClose = () => {
    setShow(false)
    console.log('closed?')
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{getMessage()}</Modal.Title>
        </Modal.Header>
        <Button onClick={handleClose}>Kapat</Button>
      </Modal>
    </>
  )
}
