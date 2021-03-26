import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import PlayGame from './game/PlayGame'
import Login from './auth/Login'
import Signup from './auth/Signup'
import VerifyEmail from './auth/VerifyEmail'
import PasswordReset from './auth/PasswordReset'
import PasswordResetConfirm from './auth/PasswordResetConfirm'

import Home from './home/Home'
import Profile from './profile/Profile'
import PageNotFound from './shared/components/PageNotFound'
import PrivateRoute from './shared/components/PrivateRoute'
import GameAnalyze from './game/GameAnalyze'

import BaseTemplate from './shared/components/AppBar'
import {
  SocketProvider,
  PlayersProvider,
  AuthProvider,
} from './shared/contexts'
import useLocalStorage from './shared/hooks/useLocalStorage'

function App() {
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser')
  const [isGameStarted, setIsGameStarted] = useLocalStorage('isGameStarted')
  console.log('isGameStarted', isGameStarted)
  return (
    <AuthProvider>
      <SocketProvider currentUser={currentUser}>
        <Pages currentUser={currentUser} setCurrentUser={setCurrentUser} />
      </SocketProvider>
    </AuthProvider>
  )
}

function Pages({ currentUser, setCurrentUser }) {
  return (
    <>
      <Router>
        <PlayersProvider>
          <PrivateRoute>
            <BaseTemplate currentUser={currentUser} />
          </PrivateRoute>
          <Switch>
            <Route exact path='/'>
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            </Route>
            <Route path='/signup'>
              <Signup />
            </Route>
            <Route path='/login'>
              <Login onSubmitUser={setCurrentUser} />
            </Route>
            <Route path='/email-verify'>
              <VerifyEmail />
            </Route>
            <Route path='/password-reset'>
              <PasswordReset />
            </Route>
            <Route path='/password-reset-complete/:uidb64/:token'>
              <PasswordResetConfirm />
            </Route>
            <Route path='/play/online'>
              <PlayGame />
            </Route>
            <Route path='/games/:id'>
              <GameAnalyze />
            </Route>
            <Route path='/:username'>
              <Profile />
            </Route>
            <Route path='*'>
              <PageNotFound />
            </Route>
          </Switch>
        </PlayersProvider>
      </Router>
    </>
  )
}

export default App
