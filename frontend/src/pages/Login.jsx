import { useState } from 'react'
import { useNavigate } from 'react-router'

// login form. for now it just checks the boxes aren't empty and goes to the dashboard
// later it'll check username/password with the backend
function Login() {
  // what's typed in each box
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // error message to show, empty = no error
  const [error, setError] = useState('')

  // lets us change pages from code
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault() // stops the browser from reloading the page

    // empty string counts as false, so this catches either box being empty
    if (!username || !password) {
      setError('Please fill in both fields')
      return // stop here, don't log in
    }

    setError('') // clear old error
    console.log('logging in as', username)
    navigate('/') // go to dashboard
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Zoo Admin Login</h2>

        <label>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

               {error ? <p className="error">{error}</p> : null}

        <button type="submit">Log in</button>
      </form>
    </div>
  )
}

export default Login