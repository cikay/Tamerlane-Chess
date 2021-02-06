import React, { useState, useRef } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Card, Button, Form, Container, Alert } from 'react-bootstrap'
import { useAuthContext } from '../contexts/AuthContext'

const Signup = (props) => {
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: '',
    displayForm: true,
    loading: false,
  })

  const [error, setError] = useState({
    isError: null,
    message: '',
  })
  const { history } = props
  const { signup } = useAuthContext()

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
    const { email, password, confirmPassword, firstname, lastname } = formData
    console.log('formData', formData)
    if (password !== confirmPassword) {
      setError((prevState) => ({
        ...prevState,
        isError: true,
        message: 'Şifreler eşleşmiyor',
      }))
      return
    }

    try {
      const res = await signup({ email, password, firstname, lastname })
      setFormData((prevState) => ({
        ...prevState,
        displayForm: false,
      }))
    } catch (err) {}
  }

  return (
    <Container
      className='d-flex align-items-center justify-content-center'
      style={{ minHeight: '70vh' }}
    >
      {formData.displayForm ? (
        <Card className='w-100' style={{ maxWidth: '430px' }}>
          <Card.Body>
            <h2 className='text-center mb-4'>Kayıt ol</h2>
            {error.isError && <Alert variant='danger'>{error.message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id='firstname'>
                <Form.Label>Adınız</Form.Label>
                <Form.Control
                  type='text'
                  id='firstname'
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group id='lastname'>
                <Form.Label>Soyadınız</Form.Label>
                <Form.Control
                  type='text'
                  id='lastname'
                  onChange={handleChange}
                  required
                />
              </Form.Group>
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
              <Form.Group id='confirm-password'>
                <Form.Label>Şifre Doğrulama</Form.Label>
                <Form.Control
                  type='password'
                  onChange={handleChange}
                  id='confirmPassword'
                  required
                />
              </Form.Group>
              <Button
                className='w-100'
                type='submit'
                disabled={formData.loading}
              >
                Kayıt ol
              </Button>
            </Form>
          </Card.Body>
          <div className='w-100 text-center mt-2'>
            <Link to='/login'>Giriş Yap</Link>
          </div>
        </Card>
      ) : (
        <Alert variant='info'>Mail adresinizi doğrulayınız!</Alert>
      )}
    </Container>
  )
}

export default withRouter(Signup)
