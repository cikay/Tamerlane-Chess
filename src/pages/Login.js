import React, { useState, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { Card, Button, Form, Container, Alert } from 'react-bootstrap'
import { useAuthContext } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
const Login = (props) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState({
    isError: null,
    message: '',
  })
  const { history } = props
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
    } catch (err) {}
  }

  return (
    <Container
      className='d-flex align-items-center justify-content-center'
      style={{ minHeight: '70vh' }}
    >
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
    </Container>
  )
}

export default withRouter(Login)
