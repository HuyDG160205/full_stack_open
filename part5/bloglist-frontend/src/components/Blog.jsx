import { useState } from 'react'
const Blog = ({ blog, updateLikesBlogs, removeThisBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const updateLikes = async () => {
    updateLikesBlogs({ ...blog, likes: blog.likes + 1 })
  }

  const removeBlog = async () => {
    if (window.confirm('are you sure?')) {
      removeThisBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      <button onClick={toggleVisibility}>View</button>
      <div style={hideWhenVisible} className="blogFirst">
        <div>
          {blog.title} {blog.author}
        </div>
      </div>

      <div style={showWhenVisible} className="blogSecond">
        <div>
          {blog.title} {blog.author}
        </div>
        <div>{blog.url}</div>
        <div>
          {blog.likes} likes
          <button onClick={updateLikes}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <button onClick={removeBlog}>Remove</button>
      </div>
    </div>
  )
}
export default Blog
