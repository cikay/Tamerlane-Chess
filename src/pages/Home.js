import React, { useState } from 'react'
import Dialog from '../components/Dialog'
import GameSettings from '../components/GameSettings'
import AppBar from '../components/AppBar'
import { ListGroup, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuthContext, usePlayersContext } from '../contexts'
import SearchIcon from '@material-ui/icons/Search'
import { InputBase } from '@material-ui/core'
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

  const searchClick = async (e) => {
    const value = e.target.value
    console.log('value', value)
    if (value) {
      if (users.length === 0 || users.length > 0) {
        const res = await getUser(value)
        console.log('search', res.data)
        if (res.data.length === 1) {
          console.log('length 1')
          setSelectedUser(users[0])
        }
      }
    } else {
      console.log('reset users')
      resetUsers(() => [])
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
      <div>
        <div>
          <SearchIcon />
        </div>
        <InputBase
          placeholder='Search…'
          // classes={{
          //   root: classes.inputRoot,
          //   input: classes.inputInput,
          // }}
          // inputProps={{ 'aria-label': 'search' }}
          onChange={searchClick}
        />
      </div>
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
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      )}
    </>
  )
}

export default Home
