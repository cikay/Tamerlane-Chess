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
import PageNotFound from './components/PageNotFound'
import PrivateRoute from './components/PrivateRoute'
import {
  AuthProvider,
  TamerlaneChessProvider,
  SocketProvider,
} from './contexts'


function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path='/signup'>
            <Signup />
          </Route>
          <Route path='/login'>
            <Login />
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
          <Route exact path='/'>
            <SocketProvider>
              <TamerlaneChessProvider>
                <PrivateRoute></PrivateRoute>
              </TamerlaneChessProvider>
            </SocketProvider>
          </Route>
          <Route path='*'>
            <PageNotFound />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  )
}

export default App
