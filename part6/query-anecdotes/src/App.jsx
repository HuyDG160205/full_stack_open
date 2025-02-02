import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import messageContext, { MessageContextProvider } from './CounterContext'
import { useContext } from 'react'
const App = () => {
  const queryClient = useQueryClient()

  const [message, dispatch] = useContext(messageContext)

  const handleVote = (anecdote) => {
    voteAnecdote.mutate({ ...anecdote, votes: anecdote.votes + 1 })

    dispatch({
      type: 'SET_MESSAGE',
      message: `you voted for '${anecdote.content}'`,
    })

    setTimeout(() => {
      dispatch({
        type: 'SET_MESSAGE',
        message: '',
      })
    }, 5000)
  }

  // const newAnecdote = useMutation({
  //   mutationFn: createAnecdote,
  //   onSuccess: (newAnecdote) => {
  //     const anecdotes = queryClient.getQueryData('anecdotes')
  //     queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
  //   },
  // })

  const voteAnecdote = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries(['anecdotes'])
    },
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
