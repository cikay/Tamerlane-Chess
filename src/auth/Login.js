import React, { useState, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { Card, Button, Form, Container, Alert } from 'react-bootstrap'
import { useAuthContext } from '../shared/contexts'
import { Link, useHistory } from 'react-router-dom'
import CenteredContainer from '../shared/components/CenteredContainer'
// import { useUserContext } from '../../contexts'
const Login = ({ onSubmitUser }) => {
  // const {setCurrentUser} = useUserContext()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const history = useHistory()

  const [error, setError] = useState({
    isError: null,
    message: '',
  })
  const { login } = useAuthContext()

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }))
  }

  const redirectToLogin = () => {
    history.push('/login')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = formData
    console.log('formData', formData)

    try {
      const res = await login(formData)
      console.log('res', res)
      onSubmitUser(res)
      console.log('redirected to home')
      history.push('/')
    } catch (err) {}
  }

  return (
    <CenteredContainer>
      <Card className='w-100' style={{ maxWidth: '430px' }}>
        <Card.Body>
          <h2 className='text-center mb-4'>Giriş yap</h2>
          {error.isError && <Alert variant='danger'>{error.message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                id='email'
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group id='password'>
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type='password'
                id='password'
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button className='w-100' type='submit'>
              Giriş yap
            </Button>
          </Form>
        </Card.Body>
        <div className='w-100 text-center mt-2'>
          Hesabınız yok mu? <Link to='/signup'>Kaydol</Link>
        </div>
      </Card>
    </CenteredContainer>
  )
}

export default withRouter(Login)
