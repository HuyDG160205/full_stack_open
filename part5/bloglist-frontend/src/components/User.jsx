import { useSelector } from 'react-redux'
import { useMatch } from 'react-router-dom'

const User = ({ user }) => {
  const users = useSelector((state) => state.users)

  const match = useMatch('/users/:id')
  const userToFind = match ? users.find((u) => u.id === Number(match.params.id)) : null

  if (!userToFind) {
    return <div>asd</div>
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
