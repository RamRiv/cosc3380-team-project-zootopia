import { Routes, Route } from 'react-router'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

// each Route = one url -> one page
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App