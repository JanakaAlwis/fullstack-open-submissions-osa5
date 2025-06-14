import { useState } from 'react'

const Blog = ({ blog, user, updateLikes, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    updateLikes(blog.id, {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    })
  }

  const handleDelete = () => {
    deleteBlog(blog.id)
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {user.username === blog.user.username && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
