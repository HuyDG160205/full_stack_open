import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import CreateNew from './components/CreateNew'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const result = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(result))
      setUser(result)
      setUsername('')
      setPassword('')
      blogService.setToken(result.token)
    } catch (exception) {
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    noteFormRef.current.toggleVisibility()

    try {
      const addedBlog = await blogService.create(blogObject)

      addedBlog.user = user

      setBlogs(blogs.concat(addedBlog))

      setMessage(`a new blog ${title} by ${author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('Error while adding blog')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const Remove = async (id) => {
    try {
      await blogService.removeBlog(id)
      setBlogs(blogs.filter((b) => b.id !== id))
    } catch (exception) {
      setMessage('Error while deleting blog')
    }
  }

  const noteFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs.sort(compareLikes)))
  }, [])

  const compareLikes = (b1, b2) => b2.likes - b1.likes

  const updateLikes = async (updatedBlog) => {
    await blogService.updateLikes(updatedBlog.id, updatedBlog)
    setBlogs(blogs.map((b) => (b.id !== updatedBlog.id ? b : updatedBlog)))
  }

  // const loginForm = () => (
  //   <loginForm
  //     handleUsernameChange={({ target }) => setUsername(target.value)}
  //     handlePasswordChange={({ target }) => setPassword(target.value)}
  //     handleSubmit={handleLogin}
  //     username={username}
  //     password={password}
  //   />
  // )

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <div>
      <h1>blogs</h1>
      <Notification message={message} />
      {/* if user is not logged in */}
      {!user && (
        <LoginForm
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
          username={username}
          password={password}
        />
      )}

      {/* if user is logged in */}
      {user && (
        <div>
          <p>{user.name} logged in</p>

          <Togglable buttonLabel="new blog" ref={noteFormRef}>
            <CreateNew createBlog={addBlog} />
          </Togglable>

          <button onClick={handleLogout}>logout</button>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateLikesBlogs={updateLikes}
              removeThisBlog={Remove}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
