import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    addBlog(state, action) {
      console.log(action.payload)

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
    },
    commentThisBlog(state, action) {
      const id = action.payload.id

      const blogToChange = state.find((b) => b.id === id)
      const changedBlog = {
        ...blogToChange,
        comments: blogToChange.comments.concat(action.payload.comment)
      }

      return state.map((b) => (b.id !== id ? b : changedBlog))
    }
  }
})

export const { addBlog, setBlog, removeBlog, likeBlog, commentThisBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlog(blogs))
  }
}

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlogs = await blogService.create(blogObject)

    console.log(newBlogs)

    dispatch(addBlog(newBlogs))
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

export const commentBlog = (id, comment) => {
  return async (dispatch) => {
    await blogService.commentBlog(id, comment)
    dispatch(commentThisBlog({ id, comment }))
  }
}

export default blogSlice.reducer
