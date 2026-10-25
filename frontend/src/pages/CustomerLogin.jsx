import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { loginCustomer } from '../customerAuth.js'

// customer login. checks email/password with the backend (/api/login)
function CustomerLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    if (!email || !password) {
      setError('Please fill in both fields')
      return
    }

    try {
      // customers use their email as their username
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
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
      navigate('/tickets')
    } catch (err) {
      setError('Could not connect to the server')
    }
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Customer Login</h2>

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

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