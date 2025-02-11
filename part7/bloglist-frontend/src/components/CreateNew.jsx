import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { showNotification } from '../reducers/notificationReducer'

const CreateNew = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const addBlog = (event) => {
    event.preventDefault()

    try {
      const blog = {
        title,
        author,
        url
      }

      if (!user) {
        return null
      }

      // blog.user = user

      dispatch(createBlog(blog))

      setTitle('')
      setAuthor('')
      setUrl('')

      dispatch(showNotification(`a new blog ${title} by ${author} added`, 5))
    } catch (error) {
      dispatch(showNotification(error.response.data.error, 5))
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            id='title'
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder='title'
          />
        </div>
        <div>
          author
          <input
            id='author'
            type='text'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='author'
          />
        </div>
        <div>
          url
          <input id='url' type='text' value={url} onChange={({ target }) => setUrl(target.value)} placeholder='url' />
        </div>
        <button id='create-button' type='submit'>
          create
        </button>
      </form>
    </div>
  )
}

export default CreateNew
