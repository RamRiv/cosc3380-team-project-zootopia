import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { loginCustomer } from '../customerAuth.js'

// customer login. checks username/password with the backend (/api/login)
function CustomerLogin() {
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const navigate = useNavigate();

async function handleSubmit(e) {
  e.preventDefault()

  const cleanUsername = username.trim()

  if (!cleanUsername || !password) {
    setError('Please fill in both fields')
    return
  }

  try {
    // customers log in with their username (e.g. ava)
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: cleanUsername, password }),
    })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      // staff have their own login page
      if (data.role !== 'Customer') {
        setError('This login is for customers only')
        return
      }

      setError('')
      loginCustomer(data)
      navigate('/checkout')
    } catch (err) {
      setError('Could not connect to the server')
    }
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Customer Login</h2>

        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error ? <p className="error">{error}</p> : null}

        <button type="submit">Log in</button>

        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </form>
    </div>
  )
}

export default CustomerLogin