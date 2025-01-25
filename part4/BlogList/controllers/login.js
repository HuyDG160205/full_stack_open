const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userToken = {
    username: user.username,
    id: user.id,
  }

  //expire in 1 hour
  const token = jwt.sign(userToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  })
  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
