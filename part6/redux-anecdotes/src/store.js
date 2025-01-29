import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'
import anecdotereducer from './reducers/anecdoteReducer'

const store = configureStore({
  reducer: {
    anecdotes: anecdotereducer,
    filter: filterReducer,
    notification: notificationReducer,
  },
})

export default store
