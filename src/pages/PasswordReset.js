import React, { useState, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { Card, Button, Form, Container, Alert } from 'react-bootstrap'
import { useAuthContext } from '../contexts/AuthContext'

const Login = (props) => {
  const [formData, setFormData] = useState({
    email: '',
  })

  const [error, setError] = useState({
    isError: null,
    message: '',
  })
  const { history } = props
  const { verify } = useAuthContext()

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
      const res = await verify(formData)
    } catch (err) {}
  }

  return (
    <Container
      className='d-flex align-items-center justify-content-center'
      style={{ minHeight: '70vh' }}
    >
      <Card className='w-100' style={{ maxWidth: '430px' }}>
        <Card.Body>
          <h2 className='text-center mb-4'>Şifre sıfırlama</h2>
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

            <Button className='w-100' type='submit'>
              Şifre sıfırla
            </Button>
          </Form>
        </Card.Body>
      </Card>
     
    </Container>
  )
}

export default withRouter(Login)
