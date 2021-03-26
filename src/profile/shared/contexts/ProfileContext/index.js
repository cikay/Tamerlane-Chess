import React, { useState, useContext } from 'react'
import axios from 'axios'
import { useAuthContext } from '../../../../shared/contexts'

const ProfileContext = React.createContext()
export const useProfileContext = () => useContext(ProfileContext)

export function ProfileProvider({ children }) {
  const [state, setState] = useState({})
  const { user } = useAuthContext()
  const getPlayedGames = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/${user.username}/games`
    )
    console.log('games res', res)
    setState((prevState) => ({ ...prevState, games: res.game }))
  }

  const getGameById = async (gameId) => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/${user.username}/games/${gameId}`
    )
    setState((prevState) => ({ ...prevState, game: res.data }))
  }

  const value = { ...state, getPlayedGames, getGameById }
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}
