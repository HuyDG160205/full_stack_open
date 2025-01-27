import { useDispatch } from 'react-redux'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addNewAnecdote = (content) => {
    dispatch({
      type: 'NEW_ANECDOTE',
      data: { content },
    })
  }

  return (
    <div>
      <h2>create new</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addNewAnecdote(e.target.content.value)
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
