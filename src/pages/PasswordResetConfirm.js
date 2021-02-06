import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'

import { useAuthContext } from '../contexts/AuthContext'

const PasswordResetConfirm = (props) => {
  const { history, match } = props
  const { resetPasswordConfirm } = useAuthContext()
  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
    response: '',
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { uidb64, token } = match.params
    const { password, confirmPassword, response } = state
    if (password !== confirmPassword) {
      return
    }

    const payload = {
      password: state.password,
      token: token,
      uidb64: uidb64,
    }
    try {
      const res = await resetPasswordConfirm(payload)
    } catch (err) {
    }
  }
  return (
    <>
      <form display={state.response ? 'none' : 'block'}>
        <input
          type='password'
          id='password'
          value={state.password}
          onChange={(e) => handleChange(e)}
          placeholder='Yeni şifrenizi giriniz'
        />
        <input
          type='password'
          id='confirmPassword'
          value={state.confirmPassword}
          onChange={(e) => handleChange(e)}
          placeholder='Yeni şifrenizi tekrar giriniz!'
        />
        <button type='submit' onClick={(e) => handleSubmit(e)}>
          Gönder
        </button>
      </form>
    </>
  )
}

export default withRouter(PasswordResetConfirm)
