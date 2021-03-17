import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// import Navbar from './components/Navbar'
// import About from './components/About'
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
import MovesHistory from './components/MovesHistory'

import BaseTemplate from './components/AppBar'
import TamerlaneChessBoard from './tamerlane-chessboard'
import { AuthProvider, PlayersProvider, SocketProvider } from './contexts'
import useLocalStorage from './hooks/useLocalStorage'

function App() {
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser')
  const [isGameStarted, setIsGameStarted] = useLocalStorage('isGameStarted')
  console.log('isGameStarted', isGameStarted)
  return (
    <AuthProvider>
      <SocketProvider>
        <PlayersProvider>
          <Router>
            <PrivateRoute Component={BaseTemplate} />
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
              <Route path='/:username'>
                <Profile />
              </Route>
              <SocketProvider currentUser={currentUser}>
                <PlayersProvider currentUser={currentUser}>
                  <Route exact path='/'>
                    <PrivateRoute Component={Home}></PrivateRoute>
                  </Route>
                  <Route path='/play'>
                    <TamerlaneChessBoard
                      isGameStarted={isGameStarted}
                      setIsGameStarted={setIsGameStarted}
                    />
                    {/* {state.winner ? <GameFinishDialog /> : <Timer />}
                  <Board></Board>
                  <MovesHistory moves={} />
                </TamerlaneChessBoard> */}
                  </Route>
                </PlayersProvider>
              </SocketProvider>
              <Route path='*'>
                <PageNotFound />
              </Route>
            </Switch>
          </Router>
        </PlayersProvider>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
