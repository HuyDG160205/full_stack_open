import { useEffect } from 'react'
import userService from '../services/users'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../reducers/userReducer'
import { Link } from 'react-router-dom'

const Users = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <h2>Users</h2>
      {users.map((user) => (
        <div key={user.id}>
          <Link to={`/users/${user.id}`}>{user.name}</Link> has {user.blogs.length} blogs
        </div>
      ))}
    </div>
  )
}

export default Users
