import { useDispatch } from 'react-redux'
import { commentBlog, removeThisBlog, updateLikes } from '../reducers/blogReducer'
import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import { showNotification } from '../reducers/notificationReducer'

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch()

  if (!blog) {
    return <Navigate to='/' />
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const Comments = () => {
    return (
      <div>
        <h2>comments</h2>
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    )
  }

  const CommentForm = () => {
    const [comment, setComment] = useState('')

    const handleSubmit = (event) => {
      event.preventDefault()
      dispatch(commentBlog(blog.id, comment))
      setComment('')
    }

    return (
      <div>
        <h2>add comment</h2>
        <form onSubmit={handleSubmit}>
          <input type='text' value={comment} onChange={(event) => setComment(event.target.value)} />
          <button type='submit'>add comment</button>
        </form>
      </div>
    )
  }

  const likeBlog = async () => {
    dispatch(updateLikes(blog.id, blog))
  }

  const removeBlog = async () => {
    if (window.confirm('are you sure?')) {
      dispatch(removeThisBlog(blog.id))
      dispatch(showNotification(`blog ${blog.title} removed`, 5))
      return <Navigate to='/' />
    }
  }

  return (
    <div className='blog' style={blogStyle}>
      <h2>{blog.title}</h2>
      <div>{blog.url}</div>
      <div>
        {blog.likes} likes
        <button onClick={likeBlog}>like</button>
      </div>
      <div>
        Added by {blog.user.name}
        {user.username === blog.user.username && <button onClick={removeBlog}>Remove</button>}
      </div>

      <CommentForm />
      <Comments />
    </div>
  )
}

export default Blog
