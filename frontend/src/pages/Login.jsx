import { useState } from 'react'
import { useNavigate } from 'react-router'


// login form. for now it just checks the boxes aren't empty and goes to the dashboard
// later it'll check username/password with the backend
// login form. checks against TEST_USERS for now
// later it'll check username/password with the backend

// TEMP fake accounts until the backend login works
// delete this once we hook up the real database
const TEST_USERS = [
  { username: 'mclark', password: 'test123', role: 'Director' },
  { username: 'tkim', password: 'test123', role: 'Keeper' },
  { username: 'qbaker', password: 'test123', role: 'Cashier' },
]

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

    // look for an account where both username and password match
    const user = TEST_USERS.find(
      (u) => u.username === username && u.password === password
    )

    if (!user) {
      setError('Invalid username or password')
      return
    }

    // made it past both checks, so log in
    setError('') // clear old error
    console.log('logged in as', user.username, 'role:', user.role)
        // remember who logged in so other pages can see it
        // (never save the password)
         localStorage.setItem('user', JSON.stringify({ username: user.username, role: user.role }))

        navigate('/dashboard') // go to dashboard 
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