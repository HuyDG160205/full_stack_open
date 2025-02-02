import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import messageContext from '../CounterContext'
import { useContext } from 'react'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [message, dispatch] = useContext(messageContext)

  const newAnecdote = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))

      dispatch({
        type: 'SET_MESSAGE',
        message: `you created '${newAnecdote.content}'`,
      })

      setTimeout(() => {
        dispatch({
          type: 'SET_MESSAGE',
          message: '',
        })
      }, 5000)
    },
    onError: (error) => {
      if (error.response.status === 400) {
        dispatch({
          type: 'SET_MESSAGE',
          message: error.response.data.error,
        })

        setTimeout(() => {
          dispatch({
            type: 'SET_MESSAGE',
            message: '',
          })
        }, 5000)
      }
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    newAnecdote.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
