import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

const PrivateRoute = ({Component}) => {
  const { isAuthenticated } = useAuthContext()
  console.log(localStorage)
  console.log(`isAuthenticated:${isAuthenticated}`)
  return (
    <Route>
      {isAuthenticated ? (
        <Component />
      ) : (
        <Redirect to={{ pathname: '/login/' }} />
      )}
    </Route>
  )
}

export default PrivateRoute
