import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Home from '../pages/Home'
import { useAuthContext } from '../contexts/AuthContext'

const PrivateRoute = () => {
  const { isAuthenticated } = useAuthContext()
  console.log(localStorage)
  console.log(`isAuthenticated:${isAuthenticated}`)
  return (
    <Route>

      {isAuthenticated ? <Home /> : <Redirect to={{ pathname: '/login/' }} />}
    </Route>
  )
}

export default PrivateRoute
