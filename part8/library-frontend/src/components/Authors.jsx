import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, SET_BIRTHYEAR } from '../queries'
import { useState } from 'react'

const Authors = ({ show }) => {
  const { data } = useQuery(ALL_AUTHORS)

  if (!show || !data) {
    return null
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthYear authors={data.allAuthors} />
    </div>
  )
}

const SetBirthYear = ({ authors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [setBirthYear] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const submit = async (event) => {
    event.preventDefault()

    setBirthYear({ variables: { name, setBornTo: Number(born) } })

    setName('')
    setBorn('')
  }

  return (
    <form onSubmit={submit}>
      <div>
        <select
          name="name"
          id="name"
          value={name}
          onChange={({ target }) => {
            setName(target.value)
          }}
        >
          <option value="">select author</option>
          {authors.map((a) => (
            <option key={a.name} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="born"
          id="born"
          value={born}
          onChange={({ target }) => setBorn(target.value)}
        />
      </div>
      <button type="submit">set birthyear</button>
    </form>
  )
}

export default Authors
