import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import axios from 'axios'

const EmailVerify = ({ history }) => {
  const initialState = {
    default: 'default',
    verified: 'verified',
    failed: 'failed',
  }

  const [emailStatus, setEmailStatus] = useState(initialState.default)

  useEffect(() => {
    const token = queryString.parse(window.location.search)

    history.replace(window.location.pathname)

    if (!token) {
      return
    }
    const BASE_API_URL = 'http://127.0.0.1:8000'

    axios
      .post(`${BASE_API_URL}/account/email-verify/`, token)
      .then((response) => {
        if (response.status !== 200) {
          setEmailStatus(initialState.failed)
          return
        }
        setEmailStatus(initialState.verified)
      })
  }, [])

  const getBody = () => {
    if (emailStatus === initialState.verified) {
      return <div>Mail adresiniz doğrulandı</div>
    } else if (emailStatus === initialState.failed) {
      return <div>Hata, mail adresiniz doğrulanmadı</div>
    }
  }

  return <div>{getBody()}</div>
}

export default withRouter(EmailVerify)
