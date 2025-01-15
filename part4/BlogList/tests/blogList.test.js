const supertest = require('supertest')
const app = require('../app')
const { test, describe, after } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')

const api = supertest(app)

describe('blog list', () => {
  test('blog are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => assert(blog.id))
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    }
    await api.post('/api/blogs').send(newBlog).expect(201)

    const response = await api.get('/api/blogs')
    const titles = response.body.map((r) => r.title)
    assert(titles.includes('React patterns'))
  })

  test("if 'likes' is missing from the request, it defaults to 0", async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    }
    const response = await api.post('/api/blogs').send(newBlog).expect(201)
    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title or url is not added', async () => {
    const newBlog = {
      author: 'Michael Chan',
      likes: 7,
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
