import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLike }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => setDetailsVisible(!detailsVisible)

  return (
    <div className="blog">
      <div className="blog-summary">
        {blog.title} {blog.author}
        <button onClick={toggleDetails} className="toggle-details-btn">
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>
      {detailsVisible && (
        <div className="blog-details">
          <div className="blog-url">{blog.url}</div>
          <div className="blog-likes">
            likes {blog.likes}
            <button onClick={onLike} className="like-btn">like</button>
          </div>
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired
  }).isRequired,
  onLike: PropTypes.func.isRequired
}

export default Blog
