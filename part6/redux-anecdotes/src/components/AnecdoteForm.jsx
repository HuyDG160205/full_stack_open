import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addNewAnecdote = (content) => {
    dispatch(createAnecdote(content))

    dispatch(showNotification(`you created '${content}'`, 5))
  }

  return (
    <div>
      <h2>create new</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addNewAnecdote(e.target.content.value)
          e.target.content.value = ''
        }}
      >
        <div>
          <input name="content" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
