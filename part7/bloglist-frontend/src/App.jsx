import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import CreateNew from './components/CreateNew'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import userService from './services/users'
import { useDispatch, useSelector } from 'react-redux'
import { initializeAllUser } from './reducers/userReducer'
import { initializeBlogs } from './reducers/blogReducer'
import Users from './components/Users'
import { Routes, Route, useMatch, Navigate, Link, useNavigate } from 'react-router-dom'
import User from './components/User'
import { initializeUser, logout } from './reducers/authReducer'
import Blogs from './components/Blogs'

const App = () => {
  const blogs = useSelector((state) => state.blog)
  const users = useSelector((state) => state.users)
  const user = useSelector((state) => state.user)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUser())
    dispatch(initializeAllUser())
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    if (!user) {
      navigate('/blogs')
    }
  }, [navigate, user])

  const match = useMatch('/users/:id')
  const userToFind = match ? users.find((u) => u.id === match.params.id) : null
  const blogMatch = useMatch('/blogs/:id')
  const blogToFind = blogMatch ? blogs.find((b) => b.id === blogMatch.params.id) : null

  return (
    <div>
      <h1>blogs</h1>
      <Notification />

      {user ? (
        <div>
          <nav>
            <Link to='/users'>users</Link>
            <Link to='/blogs'> blogs</Link>
            <p>{user.name} logged in</p>
            <button
              onClick={() => {
                dispatch(logout())
              }}
            >
              logout
            </button>
          </nav>
        </div>
      ) : (
        <LoginForm />
      )}

      <Routes>
        <Route path='/' element={<Navigate to='/blogs' replace />} />
        <Route path='/users' element={<Users />} />
        <Route path='/users/:id' element={userToFind ? <User user={userToFind} /> : <Navigate to='/users' />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route
          path='/blogs/:id'
          element={blogToFind ? <Blog blog={blogToFind} user={user} /> : <Navigate to='/blogs' />}
        />
      </Routes>
    </div>
  )
}

export default App
