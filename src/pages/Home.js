import React, { useState } from 'react'
import Dialog from '../components/Dialog'
import GameSettings from '../components/GameSettings'
import AppBar from '../components/AppBar'
import { ListGroup, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuthContext, usePlayersContext } from '../contexts'

const Home = () => {
  const history = useHistory()
  const [selectedUser, setSelectedUser] = useState()

  const { logout } = useAuthContext()
  const {
    getUser,
    playRequest,
    request,
    response,
    PLAY_STATE,
    users,
    resetUsers,
  } = usePlayersContext()

  const isCancelled = response === PLAY_STATE.Cancelled

  const logoutClick = async () => {
    try {
      await logout()
      history.push('/login')
    } catch {
      console.log('çıkış yapılamadı')
    }
  }

  const selectUser = async (e) => {
    // document.getElementById('search-input').value = ''
    resetUsers([])
    const user = JSON.parse(e.target.getAttribute('user'))
    console.log('user', user)
    // setSelectedUser(user)
    const res = await playRequest(user.id)
  }

  console.log('users', users)
  return (
    <>
      {request && <Dialog requestedPlayer={request} />}
      {isCancelled && <Alert />}
      <AppBar />
      {users && (
        <ListGroup as='ul' onClick={selectUser}>
          {users.map((user) => {
            console.log(user)
            return (
              <ListGroup.Item
                as='li'
                active
                user={JSON.stringify(user)}
                key={user.id}
                style={{ marginTop: '3px' }}
              >
                {user.username}
                {'       '}
                {user.firstname}
                {'       '}
                {user.lastname}
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      )}
    </>
  )
}

export default Home
