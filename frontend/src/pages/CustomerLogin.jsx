import { useState } from 'react'
import { Link, useNavigate } from 'react-router'                    // CHANGED: added Link
import { getCustomers, loginCustomer } from '../customerAuth.js'    // NEW

// customer login. checks the fake customer accounts for now
// later it'll check email/password with the backend
function CustomerLogin() {                                           // CHANGED: name
  const [email, setEmail] = useState('')                             // CHANGED: email, not username
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()

    if (!email || !password) {
      setError('Please fill in both fields')
      return
    }

    // CHANGED: look through customers instead of TEST_USERS
    const customer = getCustomers().find(
      (c) => c.email === email && c.password === password
    )

    if (!customer) {
      setError('Invalid email or password')
      return
    }

    setError('')
    loginCustomer(customer)   // CHANGED: instead of localStorage.setItem('user', ...)
    navigate('/tickets')      // CHANGED: go to tickets, not dashboard
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Customer Login</h2>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error ? <p className="error">{error}</p> : null}

        <button type="submit">Log in</button>

        {/* NEW: link to sign up */}
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </form>
    </div>
  )
}

export default CustomerLogin                                         // CHANGED: name