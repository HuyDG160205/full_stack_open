const express = require('express')
const User = require('../models/user')
const userRouter = express.Router()
const bcrypt = require('bcrypt')
require('dotenv').config()

userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1 })
  res.json(users)
})

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'username or password missing' })
  }

  if (username.length < 3) {
    return res
      .status(400)
      .json({ error: 'username must be at least 3 characters long' })
  }
  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: 'password must be at least 3 characters long' })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({ error: 'username must be unique' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    password: passwordHash,
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = userRouter
