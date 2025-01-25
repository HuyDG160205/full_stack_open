const express = require('express')
const blogRouter = express.Router()
const Blog = require('../models/blog')
const User = require('../models/user')
require('dotenv').config()
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'unauthorized' })
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user.id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'unauthorized' })
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'unauthorized' })
  }

  await Blog.findByIdAndDelete(request.params.id)

  response.status(200).json({ message: 'blog deleted' })
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'unauthorized' })
  }

  // if (blog.user.toString() !== user.id.toString()) {
  //   return response.status(401).json({ error: 'unauthorized' })
  // }
  //*this is not supposed to be here lmao

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
    new: true,
  })
  response.status(200).json(updatedBlog)
})

module.exports = blogRouter
