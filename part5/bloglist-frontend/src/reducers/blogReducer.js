import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    addBlog(state, action) {
      return [...state, action.payload]
    },
    setBlog(state, action) {
      return action.payload
    },
    removeBlog(state, action) {
      return state.filter((b) => b.id !== action.payload)
    },
    likeBlog(state, action) {
      const id = action.payload
      const blogToChange = state.find((b) => b.id === id)
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1
      }

      return state.map((b) => (b.id !== id ? b : changedBlog))
    }
  }
})

export const { addBlog, setBlog, removeBlog, likeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlog(blogs))
  }
}

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blogObject)

    dispatch(addBlog(newBlog))
  }
}

export const updateLikes = (id, blog) => {
  return async (dispatch) => {
    await blogService.updateLikes(id, {
      ...blog,
      likes: blog.likes + 1
    })

    dispatch(likeBlog(id, blog))
  }
}

export const removeThisBlog = (id) => {
  return async (dispatch) => {
    await blogService.removeBlog(id)
    dispatch(removeBlog(id))
  }
}

export default blogSlice.reducer
