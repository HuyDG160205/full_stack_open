import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import React from 'react'
import CreateNew from './CreateNew'

describe('CreateNew', () => {
  test('form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const title = 'Test blog'
    const author = 'test author'
    const url = 'test url'
    const createBlog = vi.fn()

    render(<CreateNew createBlog={createBlog} />)

    await userEvent.type(screen.getByPlaceholderText('title'), title)
    await userEvent.type(screen.getByPlaceholderText('author'), author)
    await userEvent.type(screen.getByPlaceholderText('url'), url)
    await userEvent.click(screen.getByText('create'))

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe(title)
    expect(createBlog.mock.calls[0][0].author).toBe(author)
    expect(createBlog.mock.calls[0][0].url).toBe(url)
  })
})
