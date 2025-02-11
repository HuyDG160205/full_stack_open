import { useSelector } from 'react-redux'
import Blog from './Blog'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Togglable from './Togglable'
import CreateNew from './CreateNew'

const Blogs = () => {
  const blogs = useSelector((state) => state.blog)

  const user = useSelector((state) => state.user)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (!blogs || !user) {
    return <Navigate to='/' />
  }

  return (
    <div>
      <Togglable buttonLabel='add blog'>
        <CreateNew />
      </Togglable>
      {blogs.map((blog) => (
        <Link to={`/blogs/${blog.id}`} key={blog.id}>
          <div style={blogStyle}>
            {blog.title} {blog.author}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Blogs
