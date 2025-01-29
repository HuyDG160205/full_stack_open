import { createSlice } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  }
}

// const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find((a) => a.id === id)
      const votedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1,
      }
      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : votedAnecdote
      )
    },
    newAnecdote(state, action) {
      const content = action.payload
      return [...state, asObject(content)]
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

// const reducer = (state = initialState, action) => {
//   if (action.type === 'VOTE') {
//     const id = action.data.id
//     return state.map((anecdote) =>
//       anecdote.id !== id ? anecdote : { ...anecdote, votes: anecdote.votes + 1 }
//     )
//   } else if (action.type === 'NEW_ANECDOTE') {
//     return [...state, asObject(action.data.content)]
//   } else {
//     return state
//   }
// }

export const { vote, newAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdotesService.create(asObject(content))
    dispatch(newAnecdote(anecdote.content))
  }
}

export const voteAnecdote = (id) => {
  return async (dispatch) => {
    const anecdote = await anecdotesService.vote(id)

    dispatch(vote(anecdote.id))
  }
}

export default anecdoteSlice.reducer
