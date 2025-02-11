import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'
const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUser(state, action) {
      return action.payload
    }
  }
})

export const { setUser } = userSlice.actions

export const initializeAllUser = () => {
  return async (dispatch) => {
    const user = await userService.getAll()
    dispatch(setUser(user))
  }
}

export default userSlice.reducer
