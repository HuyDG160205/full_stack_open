import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

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

Anecdote.propTypes = {
  anec: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired,
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
}

const compare = (a, b) => b.votes - a.votes

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) =>
    anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  )

  const dispatch = useDispatch()

  const handleClick = (id) => {
    dispatch(voteAnecdote(id))
  }

  return (
    <ul>
      {[...anecdotes].sort(compare).map((anecdote) => (
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
