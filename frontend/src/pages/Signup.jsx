import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getCustomers, addCustomer, loginCustomer } from '../customerAuth.js'

// customer sign up. fields match the customer table
function Signup() {
  // one object for the whole form instead of 6 useStates
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // one handler for every box
  // e.target.name tells us which box changed, so we update just that field
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
      setError('Please fill in every field')
      return
    }

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    // email has to be unique, same rule as the db
    const taken = getCustomers().find((c) => c.email === form.email)
    if (taken) {
      setError('An account with that email already exists')
      return
    }

    // don't save "confirm", it's only for checking
    const customer = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    }

    addCustomer(customer)
    loginCustomer(customer)
    navigate('/tickets')
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>

        <label>First name</label>
        <input name="firstName" value={form.firstName} onChange={handleChange} />

        <label>Last name</label>
        <input name="lastName" value={form.lastName} onChange={handleChange} />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />

        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />

        <label>Confirm password</label>
        <input name="confirm" type="password" value={form.confirm} onChange={handleChange} />

        {error ? <p className="error">{error}</p> : null}

        <button type="submit">Sign up</button>

        <p>Already have an account? <Link to="/customer-login">Log in</Link></p>
      </form>
    </div>
  )
}

export default Signup