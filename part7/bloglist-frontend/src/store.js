import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import authReducer from './reducers/authReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blog: blogReducer,
    users: userReducer,
    user: authReducer
  }
})

export default store
