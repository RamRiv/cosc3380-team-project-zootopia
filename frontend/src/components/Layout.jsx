import { NavLink, Outlet, useNavigate, Navigate } from 'react-router'

// the frame every page sits in: top bar + sidebar
// sidebar links depend on staff role (Cashier / Zookeeper / Manager)
function Layout() {
  const navigate = useNavigate()

  // get who's logged in (turn the saved text back into an object)
  const user = JSON.parse(localStorage.getItem('user'))

  // nobody logged in -> send them to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  const role = user.role
  const isManager = role === 'Manager'
  const isZookeeper = role === 'Zookeeper'
  const isCashier = role === 'Cashier'

  function handleLogout() {
    localStorage.removeItem('user') // forget who was logged in
    navigate('/', { replace: true })
  }

  return (
    <div className="layout">
      <header className="topbar">
        <span className="logo">Zoo Admin</span>
        <div className="user">
          {/* who's logged in, saved by the login page */}
          <span>{user.username} ({user.role})</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <nav className="sidebar">
        {/* everyone lands here after staff login */}
        <NavLink to="/dashboard">Dashboard</NavLink>

        {(isZookeeper || isManager) && (
          <NavLink to="/animals">Animals</NavLink>
        )}

        {isManager && (
          <>
            <NavLink to="/employees">Employees</NavLink>
            <NavLink to="/customers">Customers</NavLink>
          </>
        )}

        {(isCashier || isManager) && (
          <NavLink to="/products">Products</NavLink>
        )}

        {isManager && (
          <NavLink to="/new-sale">New Sale</NavLink>
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
