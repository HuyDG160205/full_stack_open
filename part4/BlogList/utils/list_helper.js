const blog = require('../models/blog')
const lodash = require('lodash')

const dummy = (blog) => {
  return 1
}

const totalLikes = (blog) => {
  return blog.reduce((total, blog) => total + blog.likes, 0)
}

const findHighestLikes = (blog) => {
  result = blog.reduce((highest, current) =>
    current.likes > highest.likes ? current : highest
  )
  return {
    title: result.title,
    author: result.author,
    likes: result.likes,
  }
}

const mostBlogs = (blog) => {
  const result = lodash
    .chain(blog)
    .groupBy('author')
    .map((value, key) => ({ author: key, value: value.length }))
    .maxBy('value')
    .value()

  return {
    author: result.author,
    value: result.value,
  }
}

module.exports = {
  dummy,
  totalLikes,
  findHighestLikes,
  mostBlogs,
}
