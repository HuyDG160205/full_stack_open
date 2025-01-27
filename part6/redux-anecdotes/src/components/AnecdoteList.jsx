import { useDispatch, useSelector } from 'react-redux'

const Anecdote = ({ anec, handleClick }) => {
  const { id, content, votes } = anec
  return (
    <li key={id}>
      <div>{content}</div>
      <div>
        has {votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </li>
  )
}

// const vote = (id) => {
//   const dispatch = useDispatch()
//   dispatch({ type: 'VOTE', data: { id } })
// }

const compare = (a, b) => b.votes - a.votes

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state)

  const dispatch = useDispatch()

  const handleClick = (id) => {
    dispatch({ type: 'VOTE', data: { id } })
  }

  return (
    <ul>
      {anecdotes.sort(compare).map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anec={anecdote}
          handleClick={() => handleClick(anecdote.id)}
        />
      ))}
    </ul>
  )
}

export default AnecdoteList
