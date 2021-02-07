import React, { useState } from 'react'

import TamerlaneChess from '../tamerlane-chessboard'
import { Button, InputGroup, FormControl, ListGroup } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
const Home = () => {
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [users, setUsers] = useState([])
  const { logout, getUser } = useAuthContext()
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
    setUsername(value)
    // console.log(e.target.value)
    if (value) {
      const res = await getUser(value)
      console.log('search', res.data)
      setUsers(res.data)
    } else {
      setUsers([])
    }
  }

  return (
    <>
      <InputGroup className='mb-1'>
        <FormControl
          placeholder='Username'
          aria-label='Username'
          aria-describedby='basic-addon1'
          onChange={searchClick}
        />
      </InputGroup>
      {users &&
        users.map((user) => {
          console.log(user)
          return (
            <ListGroup as='ul'>
              <ListGroup.Item as='li' active>
                {user.username}
              </ListGroup.Item>
            </ListGroup>
          )
        })}
      <div className='w-100 text-center mt-2'>
        <Button variant='link' onClick={logoutClick}>
          Çıkış yap
        </Button>
      </div>
    </>
  )
}

export default Home
