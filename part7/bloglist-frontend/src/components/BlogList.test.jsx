import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import React from 'react'

describe('Blog', () => {
  let container
  const updateLikesBlogs = vi.fn()
  const removeThisBlog = vi.fn()

  beforeEach(() => {
    const blog = {
      title: 'Test blog',
      author: 'test author',
      url: 'test url',
      likes: 0,
      user: {
        username: 'test user',
        name: 'test name',
      },
    }

    const { container: renderedContainer } = render(
      <Blog
        blog={blog}
        updateLikesBlogs={updateLikesBlogs}
        removeThisBlog={removeThisBlog}
      />
    )
    container = renderedContainer
  })

  test('renders title and author', () => {
    const div = container.querySelector('.blogFirst')
    expect(div).not.toHaveStyle('display: none')
  })

  test('renders url and likes when clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')

    await user.click(button)
    const div = container.querySelector('.blogSecond')
    expect(div).not.toHaveStyle('display: none')
  })

  test('calls updateLikesBlogs when like button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')

    await user.click(button)
    await user.click(button)
    expect(updateLikesBlogs.mock.calls).toHaveLength(2)
  })
})
