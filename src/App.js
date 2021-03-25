import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  Login,
  Signup,
  VerifyEmail,
  PasswordReset,
  ResetPasswordConfirm,
} from './pages/auth'
import Home from './pages/Home'
import Profile from './pages/Profile'
import PageNotFound from './components/PageNotFound'
import PrivateRoute from './components/PrivateRoute'
import GameAnalayz from './pages/GameAnalayz'

import BaseTemplate from './containers/AppBar'
import {
  AuthProvider,
  PlayersProvider,
  SocketProvider,
  TamerlaneChessProvider,
  ProfileProvider,
} from './contexts'
import useLocalStorage from './hooks/useLocalStorage'
import PlayGame from './pages/PlayGame'

function App() {
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser')
  const [isGameStarted, setIsGameStarted] = useLocalStorage('isGameStarted')
  console.log('isGameStarted', isGameStarted)
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <SocketProvider currentUser={currentUser}>
            <PlayersProvider currentUser={currentUser}>
              <TamerlaneChessProvider>
                <PrivateRoute>
                  <BaseTemplate currentUser={currentUser} />
                </PrivateRoute>
                <Switch>
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
                    <ResetPasswordConfirm />
                  </Route>
                  <Route path='/play/online'>
                    <PlayGame />
                  </Route>
                  <Route path='/:username'>
                    <Profile />
                  </Route>
                  <Route path='/:username/games/:id'>
                    <GameAnalayz />
                  </Route>
                  <Route exact path='/'>
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  </Route>
                  <Route path='*'>
                    <PageNotFound />
                  </Route>
                </Switch>
              </TamerlaneChessProvider>
            </PlayersProvider>
          </SocketProvider>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
