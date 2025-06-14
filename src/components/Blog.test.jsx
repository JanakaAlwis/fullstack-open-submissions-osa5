import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'

describe('Blog component', () => {
  const blog = {
    title: 'React Testing',
    author: 'Janaka Alwis',
    url: 'http://reacttestingjanaka.com',
    likes: 5
  }

  test('renders title and author, but not url or likes by default (5.13)', () => {
    render(<Blog blog={blog} onLike={() => {}} />)

    expect(screen.getByText('React Testing Janaka Alwis')).toBeDefined()
    expect(screen.queryByText('http://reacttestingjanaka.com')).toBeNull()
    expect(screen.queryByText('likes 5')).toBeNull()
  })

  test('shows url and likes after clicking the view button (5.14)', () => {
    render(<Blog blog={blog} onLike={() => {}} />)

    const button = screen.getByText('view')
    fireEvent.click(button)

    expect(screen.getByText('http://reacttestingjanaka.com')).toBeDefined()
    expect(screen.getByText('likes 5')).toBeDefined()
  })

  test('clicking like button twice calls event handler twice (5.15)', () => {
    const mockHandler = jest.fn()
    render(<Blog blog={blog} onLike={mockHandler} />)

    fireEvent.click(screen.getByText('view'))
    const likeButton = screen.getByText('like')

    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

describe('BlogForm component', () => {
  test('calls event handler with right details when new blog is created (5.16)', () => {
    const createBlog = jest.fn()
    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByRole('textbox', { name: /title/i })
    const authorInput = screen.getByRole('textbox', { name: /author/i })
    const urlInput = screen.getByRole('textbox', { name: /url/i })
    const createButton = screen.getByText('create')

    fireEvent.change(titleInput, { target: { value: 'Testing Title' } })
    fireEvent.change(authorInput, { target: { value: 'Test Author' } })
    fireEvent.change(urlInput, { target: { value: 'http://testurl.com' } })
    fireEvent.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'Testing Title',
      author: 'Test Author',
      url: 'http://testurl.com'
    })
  })
})
