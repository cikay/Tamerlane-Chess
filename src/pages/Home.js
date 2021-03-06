import React, { useState } from 'react'
import Dialog from '../components/Dialog'
import GameSettings from '../components/GameSettings'
import {
  Button,
  InputGroup,
  FormControl,
  ListGroup,
  Alert,
} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuthContext, usePlayersContext } from '../contexts'

const Home = () => {
  const history = useHistory()
  const [selectedUser, setSelectedUser] = useState()
  const [users, setUsers] = useState([])
  const { logout } = useAuthContext()
  const {
    getUser,
    playRequest,
    request,
    response,
    PLAY_STATE,
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
    if (value) {
      if (users.length === 0 || users.length > 0) {
        const res = await getUser(value)
        console.log('search', res.data)
        setUsers(res.data)
        if (res.data.length === 1) {
          console.log('length 1')
          setSelectedUser(users[0])
        }
      }
    } else {
      setUsers([])
    }
  }


  const selectUser = async (e) => {
    document.getElementById('search-input').value = ''
    setUsers([])
    const user = JSON.parse(e.target.getAttribute('user'))
    console.log('user', user)
    // setSelectedUser(user)
    const res = await playRequest(user.id)
  }

  return (
    <>
      {request && <Dialog requestedPlayer={request} />}
      {isCancelled && <Alert />}
      <InputGroup className='mb-2'>
        <FormControl
          placeholder='Username'
          aria-label='Username'
          aria-describedby='basic-addon1'
          onChange={searchClick}
          id='search-input'
        />
      </InputGroup>
      <ListGroup as='ul' onClick={selectUser}>
        {users?.map((user) => {
          console.log(user)
          return (
            <ListGroup.Item
              as='li'
              active
              user={JSON.stringify(user)}
              key={user.id}
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
      <div className='w-100 text-center mt-2'>
        <Button variant='link' onClick={logoutClick}>
          Çıkış yap
        </Button>
      </div>
    </>
  )
}

export default Home
