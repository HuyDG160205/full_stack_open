const supertest = require('supertest')
const app = require('../app')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('blog list', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
  })

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
    const user = {
      username: 'mluukkai',
      password: 'salainen',
    }

    const response = await api.post('/api/login').send(user)

    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response2 = await api.get('/api/blogs')
    const titles = response2.body.map((r) => r.title)
    assert(titles.includes('React patterns'))
  })

  test("if 'likes' is missing from the request, it defaults to 0", async () => {
    const user = {
      username: 'mluukkai',
      password: 'salainen',
    }

    const response = await api.post('/api/login').send(user)

    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    }
    const response2 = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response2.body.likes, 0)
  })

  test('blog without title or url is not added', async () => {
    const newBlog = {
      author: 'Michael Chan',
      likes: 7,
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('failed adding a blog', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `asdzxc`)
      .expect(401)
  })

  test('a blog can be deleted', async () => {
    const user = {
      username: 'mluukkai',
      password: 'salainen',
    }

    const response = await api.post('/api/login').send(user)

    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    }
    const response2 = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const id = response2.body.id
    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(200)
  })

  // test('blog can be updated', async () => {
  //   const newBlog = {
  //     title: 'React patterns',
  //     author: 'Michael Chan',
  //     url: 'https://reactpatterns.com/',
  //     likes: 7,
  //   }
  //   const response = await api.post('/api/blogs').send(newBlog).expect(200)
  //   const id = response.body.id
  //   const updatedBlog = {
  //     title: 'React patterns',
  //     author: 'Michael Chan',
  //     url: 'https://reactpatterns.com/',
  //     likes: 8,
  //   }
  //   await api.put(`/api/blogs/${id}`).send(updatedBlog).expect(200)
  // })
})

after(async () => {
  await mongoose.connection.close()
})
