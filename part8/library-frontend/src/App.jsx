import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { Link, Route, Routes } from 'react-router-dom'

const App = () => {
  const [page, setPage] = useState('authors')

  return (
    <div>
      <div>
        <Link
          onClick={() => setPage('authors')}
          to="/authors"
          style={{ marginRight: 10 }}
        >
          authors
        </Link>
        <Link
          onClick={() => setPage('books')}
          to="/books"
          style={{ marginRight: 10 }}
        >
          books
        </Link>
        <Link onClick={() => setPage('add')} to="/add">
          add book
        </Link>
      </div>

      <Routes>
        <Route
          path="/authors"
          element={<Authors show={page === 'authors'} />}
        />
        <Route path="/books" element={<Books show={page === 'books'} />} />
        <Route path="/add" element={<NewBook show={page === 'add'} />} />
      </Routes>
    </div>
  )
}

export default App
