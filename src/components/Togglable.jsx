import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef(({ children, buttonLabel }, refs) => {
  const [visible, setVisible] = useState(false)

  useImperativeHandle(refs, () => ({
    toggleVisibility
  }))

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      {!visible && <button onClick={toggleVisibility}>{buttonLabel}</button>}
      {visible && (
        <div>
          {children}
          <button onClick={toggleVisibility}>cancel</button>
        </div>
      )}
    </div>
  )
})

export default Togglable