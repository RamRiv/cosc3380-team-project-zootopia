import { NavLink, Outlet, useNavigate, Navigate } from 'react-router'

// the frame every page sits in: top bar + sidebar
// <Outlet /> is where the current page shows up
function Layout() {
 const navigate = useNavigate()

  // get who's logged in (turn the saved text back into an object)
  const user = JSON.parse(localStorage.getItem('user'))

  // nobody logged in -> send them to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  function handleLogout() {
    localStorage.removeItem('user') // forget who was logged in
    navigate('/login')
  }

  return (
    <div className="layout">
      <header className="topbar">
        <span className="logo">Zoo Admin</span>
        <div className="user">
          {/* hardcoded for now, will come from login later */}
                    <span>{user.username} ({user.role})</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <nav className="sidebar">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/animals">Animals</NavLink>
        <NavLink to="/employees">Employees</NavLink>
        <NavLink to="/customers">Customers</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/new-sale">New Sale</NavLink>

        <p className="nav-label">Queries</p>
        <NavLink to="/queries/animals">Find Animals</NavLink>
        <NavLink to="/queries/purchases">Purchase History</NavLink>
        <NavLink to="/queries/staff">Staff Directory</NavLink>

        <p className="nav-label">Reports</p>
        <NavLink to="/reports/revenue">Revenue</NavLink>
        <NavLink to="/reports/sales">Shop Sales</NavLink>
        <NavLink to="/reports/occupancy">Occupancy</NavLink>
      </nav>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout