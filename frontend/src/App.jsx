import { Routes, Route } from 'react-router'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import Signup from './pages/Signup.jsx'
import Tickets from './pages/Tickets.jsx'
import './App.css'
import CustomerLogin from './pages/CustomerLogin.jsx'


function App() {
  return (
    <Routes>
      {/* public pages, no login needed */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/customer-login" element={<CustomerLogin />} />

      {/* staff pages, need login, get the top bar + sidebar */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  )
}

export default App