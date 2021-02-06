import React, { useReducer, createContext, useContext } from 'react'
import axios from 'axios'

import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  ACTIVATION_SUCCES,
  ACTIVATION_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_CONFIRM_SUCCESS,
  RESET_PASSWORD_CONFIRM_FAIL,
  LOGOUT,
  AUTHENTICATED_SUCCES,
  AUTHENTICATED_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
} from './authActions'

import authReducer, { initialState } from './authReducer'

const REACT_API_URL = 'http://127.0.0.1:8000'

const AuthContext = createContext()
export const useAuthContext = () => useContext(AuthContext)
export const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = async (payload) => {
    try {
      // dispatch({  stateType: LOGIN_REQUEST })
      const res = await axios.post(`${REACT_API_URL}/account/login/`, payload)
      dispatch({
        stateType: LOGIN_SUCCESS,
        payload: res.data,
      })
      localStorage.setItem('currentUser', JSON.stringify(res))
      return res.data
    } catch (error) {
      dispatch({
        stateType: LOGIN_FAIL,
        error,
      })
      throw error
    }
  }

  const checkAuthenticated = async () => {
    if (typeof window === 'undefined') {
      dispatch({
        type: AUTHENTICATED_FAIL,
      })
    }
    if (!localStorage.getItem('access')) {
      dispatch({
        type: AUTHENTICATED_FAIL,
      })
      return
    }

    const payload = { token: localStorage.getItem('access') }

    try {
      const res = await axios.post(
        `${REACT_API_URL}/account/jwt/verify/`,
        payload
      )
      if (res.data.code !== 'token_not_valid') {
        dispatch({
          type: AUTHENTICATED_SUCCES,
        })
      } else {
        dispatch({
          type: AUTHENTICATED_FAIL,
        })
      }
    } catch (error) {
      dispatch({
        type: AUTHENTICATED_FAIL,
      })
    }
  }

  const load_posts = () => {}
  // export const load_user = (dispatch) => {

  //   if(localStorage.getItem('access')){
  //     const config = {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `JWT ${localStorage.getItem('access')}`,
  //         Accept: 'application/json',
  //       }
  //     }

  //     try{

  //       // const res = await axios.get(
  //       //   `${REACT_API_URL}/`
  //       // )

  //       // disp     }
  //   }
  // }

  const signup = async ({ email, firstname, lastname, password }) => {
    const payload = {
      email,
      firstname,
      lastname,
      password,
    }

    try {
      const res = await axios.post(
        `${REACT_API_URL}/account/register/`,
        payload
      )
      dispatch({
        stateType: SIGNUP_SUCCESS,
        payload: res.data,
      })
      return res
    } catch (err) {
      dispatch({
        stateType: SIGNUP_FAIL,
      })
      throw err
    }
  }

  const verify = async (payload) => {
    try {
      const res = await axios.post(
        `${REACT_API_URL}/account/email-verify/`,
        payload
      )
      dispatch({
        payload: res.data,
      })
    } catch (err) {
      dispatch({
        type: ACTIVATION_FAIL,
      })
    }
  }

  const resetPassword = async (payload) => {
    try {
      const res = await axios.post(
        `${REACT_API_URL}/account/password-reset-request/`,
        payload
      )
      dispatch({
        stateType: RESET_PASSWORD_SUCCESS,
        payload: res.data,
      })
      return res
    } catch (err) {
      dispatch({
        stateType: RESET_PASSWORD_FAIL,
      })
      throw err
    }
  }

  const resetPasswordConfirm = async (payload) => {
    try {
      const res = await axios.post(
        `${REACT_API_URL}/account/password-reset-confirm/`,
        payload
      )
      dispatch({
        stateType: RESET_PASSWORD_CONFIRM_SUCCESS,
        payload: res.data,
      })
      return res
    } catch (error) {
      dispatch({
        stateType: RESET_PASSWORD_CONFIRM_FAIL,
        error,
      })
      throw error
    }
  }
  const logout = () => {
    dispatch({
      stateType: LOGOUT,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        access: state.access,
        refresh: state.refresh,
        isAuthenticated: state.isAuthenticated,
        signup,
        verify,
        login,
        logout,
        checkAuthenticated,
        resetPassword,
        resetPasswordConfirm,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
