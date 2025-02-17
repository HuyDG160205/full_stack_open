const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v4: uuid } = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const mongoose = require('mongoose')
const Books = require('./models/books')
const Authors = require('./models/authors')
const { GraphQLError } = require('graphql')
const Users = require('./models/users')

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
//     born: 1963,
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
//     born: 1821,
//   },
//   { name: 'Joshua Kerievsky', id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e' },
//   { name: 'Sandi Metz', id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e' },
// ]

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
//     genres: ['refactoring'],
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
//     genres: ['agile', 'patterns', 'design'],
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
//     genres: ['refactoring'],
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
//     genres: ['refactoring', 'patterns'],
//   },
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
//     genres: ['refactoring', 'design'],
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
//     genres: ['classic', 'crime'],
//   },
//   {
//     title: 'Demons',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
//     genres: ['classic', 'revolution'],
//   },
// ]

const typeDefs = `
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    bookCount: Int!
    born: Int
    id: ID!
  }

  type User {
  username: String!
  favoriteGenre: String!
  id: ID!
  }

  type Token {
    value: String!
  }


  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(
    username: String!
    favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`
const resolvers = {
  Query: {
    bookCount: async () => await Books.countDocuments(),
    authorCount: async () => await Authors.countDocuments(),
    allBooks: async (_, args) => {
      if (args.author && args.genre) {
        return await Books.find({
          author: args.author,
          genres: { $elemMatch: { $eq: args.genre } },
        })
      }
      if (args.author) {
        return await Books.find({ author: args.author })
      }
      if (args.genre) {
        return await Books.find({ genres: { $elemMatch: { $eq: args.genre } } })
      }
      return await Books.find({})
    },
    allAuthors: async () => {
      const authors = await Authors.find({})
      const books = await Books.find({})
      return authors.map((author) => {
        return {
          name: author.name,
          bookCount: books.filter(
            (book) => book.author.toString() === author.id
          ).length,
          born: author.born,
        }
      })
    },
    me: async (_, __, context) => {
      if (!context.currentUser) {
        return null
      }
      return context.currentUser
    },
  },

  Mutation: {
    addBook: async (_, args) => {
      try {
        const author = await Authors.findOne({ name: args.author })
        if (!author) {
          const newAuthor = new Authors({ name: args.author })
          await newAuthor.save()
          author = newAuthor
        }

        const book = new Books({ ...args, author: author.id })
        await book.save()

        return book.populate('author')
      } catch (error) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
    },
    editAuthor: async (_, args) => {
      const author = await Authors.findOne({ name: args.name })
      if (!author) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      author.born = args.setBornTo
      await author.save()

      return author
    },
    createUser: async (_, args) => {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash('password', saltRounds)

      const user = new Users({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
        passwordHash,
      })

      const savedUser = await user.save()

      return savedUser
    },
    login: async (_, args) => {
      const user = await Users.findOne({ username: args.username })
      const passwordCorrect =
        user === null
          ? false
          : await bcrypt.compare(args.password, user.passwordHash)

      if (!(user && passwordCorrect)) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await Users.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
