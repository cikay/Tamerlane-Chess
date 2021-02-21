import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { usePlayersContext } from '../contexts'
export default function Dialog({ requestedPlayer }) {
  console.log('requestedPlayer', requestedPlayer)
  const { sendPlayResponse } = usePlayersContext()
  const [show, setShow] = useState(true)
  const handleAccept = () => {
    console.log('istek kabul edildi')
    sendPlayResponse(requestedPlayer, true)
    setShow(false)
    // resetRequest()
  }

  const handleCancel = () => {
    console.log('istek reddedildi')
    sendPlayResponse(false)
    setShow(false)
    // resetRequest()
  }

  return (
    <Modal show={show} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Online oynama isteği</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{requestedPlayer.username} sizinle oynamak istiyor!</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCancel}>
          Reddet
        </Button>
        <Button variant='primary' onClick={handleAccept}>
          Kabul et
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
