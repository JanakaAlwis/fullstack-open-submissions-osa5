const Notification = ({ notification }) => {
  if (notification === null) return null

  const style = {
    color: notification.type === 'error' ? 'red' : 'green',
    background: '#ddd',
    border: `2px solid ${notification.type === 'error' ? 'red' : 'green'}`,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification
