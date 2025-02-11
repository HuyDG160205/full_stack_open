import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { showNotification } from './notificationReducer'
const authSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    }
  }
})

export const { setUser } = authSlice.actions

export const initializeUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const result = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(result))
      blogService.setToken(result.token)
      dispatch(setUser(result))
    } catch (error) {
      dispatch(setUser(null))
      dispatch(showNotification(error.response.data.error, 5))
    }
  }
}

export const logout = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(setUser(null))
  }
}

export default authSlice.reducer
