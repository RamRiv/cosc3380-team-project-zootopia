import { Routes, Route } from 'react-router'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import './App.css'

function App() {
  return (
    <Routes>
      {/* login has no sidebar */}
      <Route path="/login" element={<Login />} />

      {/* every page in here gets the top bar + sidebar */}
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        {/* * = any url we haven't made a page for yet */}
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  )
}

export default App