import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Home from '../pages/home'
import { useAuthContext } from '../contexts/AuthContext'
const PrivateRoute = () => {
  const { isAuthenticated } = useAuthContext()
  console.log(localStorage)
  console.log(`isAuthenticated:${isAuthenticated}`)
  let auth = false
  return (
    <Route>
      {auth ? <Home /> : <Redirect to={{ pathname: '/signup/' }} />}
    </Route>
  )
}

export default PrivateRoute
