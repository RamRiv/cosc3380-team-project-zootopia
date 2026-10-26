import { NavLink, Outlet, useNavigate, Navigate } from 'react-router'
import { ZOO_NAME } from '../zooInfo.js'

// staff frame: top bar + sidebar
// sidebar links depend on role (Manager / Zookeeper / Cashier)
function Layout() {
  const navigate = useNavigate()

  // who's logged in
  const user = JSON.parse(localStorage.getItem('user'))

  // not logged in -> staff login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  const role = user.role
  const isManager = role === 'Manager'
  const isZookeeper = role === 'Zookeeper'
  const isCashier = role === 'Cashier'

  function handleLogout() {
    localStorage.removeItem('user')
    navigate('/', { replace: true })
  }

  return (
    <div className="layout">
      <header className="topbar">
        <span className="logo">{ZOO_NAME} Staff</span>
        <div className="user">
          <span>{user.username} ({user.role})</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <nav className="sidebar">
        <NavLink to="/dashboard">Dashboard</NavLink>

        {(isZookeeper || isManager) && (
          <NavLink to="/animals">Animals</NavLink>
        )}

        {(isCashier || isManager) && (
          <NavLink to="/products">Products</NavLink>
        )}

        <p className="nav-label">Queries</p>
        {(isZookeeper || isManager) && (
          <>
            <NavLink to="/queries/animals">Find Animals</NavLink>
            <NavLink to="/queries/species">Find Species</NavLink>
          </>
        )}
        {(isCashier || isManager) && (
          <NavLink to="/queries/products">Find Products</NavLink>
        )}

        {isManager && (
          <>
            <p className="nav-label">Reports</p>
            <NavLink to="/reports/occupancy">Enclosure Occupancy</NavLink>
            <NavLink to="/reports/sales">Product Sales</NavLink>
            <NavLink to="/reports/spending">Customer Spending</NavLink>
          </>
        )}
      </nav>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout