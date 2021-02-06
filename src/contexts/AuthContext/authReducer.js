import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  ACTIVATION_SUCCES,
  ACTIVATION_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_CONFIRM_SUCCES,
  RESET_PASSWORD_CONFIRM_FAIL,
  LOGOUT,
  AUTHENTICATED_SUCCES,
  AUTHENTICATED_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
} from './authActions'

export const initialState = {
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
  isAuthenticated: localStorage.getItem('currentUser') ? true : false,
  user: localStorage.getItem('currentUser'),
}

export default function authReducer(state = initialState, action) {
  const { stateType, payload } = action
  switch (stateType) {
    case AUTHENTICATED_SUCCES:
      return {
        ...state,
        isAuthenticated: true,
      }
    case LOGIN_SUCCESS:
      console.log(payload)
      localStorage.setItem('access', payload.tokens.access)
      localStorage.setItem('currentUser', payload.user)
      return {
        ...state,
        user: payload,
      }
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
      }
    case USER_LOADED_FAIL:
      return {
        ...state,
        user: null,
      }
    case SIGNUP_FAIL:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.clear()
      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null,
      }
    default:
      return state
  }
}
