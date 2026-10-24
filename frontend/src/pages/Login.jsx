import { useState } from 'react'
import { useNavigate } from 'react-router'

// staff login. checks username/password with the backend (/api/login)





function Login() {
  // what's typed in each box
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // error message to show, empty = no error
  const [error, setError] = useState('')

  // lets us change pages from code
  const navigate = useNavigate()

   // async = this function waits for the backend to answer
  async function handleSubmit(e) {
    e.preventDefault()

    if (!username || !password) {
      setError('Please fill in both fields')
      return
    }

    try {
      // send what they typed to the backend
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      // turn the backend's answer into an object
      const data = await response.json()

      // backend said no (wrong username or password)
      if (!response.ok) {
        setError(data.error)
        return
      }

      // customers have their own login page
      if (data.role === 'Customer') {
        setError('This login is for staff only')
        return
      }

      // remember who logged in
      setError('')
      localStorage.setItem('user', JSON.stringify({
        username: data.username,
        role: data.role,
        employeeId: data.employeeId,
      }))
      navigate('/dashboard')
    } catch (err) {
      // couldn't reach the backend at all
      setError('Could not connect to the server')
    }
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