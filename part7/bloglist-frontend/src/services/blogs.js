import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  // console.log(response.data)

  return response.data
}

const create = async (newObject) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(baseUrl, newObject, config)
  // console.log(response.data)

  return response.data
}

const updateLikes = async (id, newObject) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

const removeBlog = async (id) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const commentBlog = async (id, comment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, { comment: comment })
  return response.data
}

export default { getAll, setToken, create, updateLikes, removeBlog, commentBlog }
