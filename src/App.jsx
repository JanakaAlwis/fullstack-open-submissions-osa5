import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      notifyWith(`Welcome ${user.name}`)
    } catch (exception) {
      notifyWith('Wrong credentials', true)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(blogObject)
      const completeBlog = await blogService.getById(newBlog.id)
      setBlogs(blogs.concat(completeBlog).sort((a, b) => b.likes - a.likes))
      notifyWith(`a new blog '${newBlog.title}' by ${newBlog.author} added`)
    } catch (exception) {
      notifyWith('error adding blog', true)
    }
  }

  const updateLikes = async (id, blogObject) => {
    const updated = await blogService.update(id, blogObject)
    const updatedBlogs = blogs.map(b => b.id === id ? updated : b)
    setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
  }

  const deleteBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
    }
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification notification={notification} />

      {!user && <LoginForm handleLogin={handleLogin} />}
      {user && (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} user={user} updateLikes={updateLikes} deleteBlog={deleteBlog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App