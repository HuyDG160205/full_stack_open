import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async (content) => {
  const response = await axios.post(baseUrl, { ...content })
  return response.data
}

const vote = async (id) => {
  const anecdote = await getById(id)

  const response = await axios.put(`${baseUrl}/${id}`, {
    ...anecdote,
    votes: anecdote.votes + 1,
  })

  return response.data
}

export default { getAll, create, vote }
