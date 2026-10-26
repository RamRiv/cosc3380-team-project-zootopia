import { Navigate } from 'react-router'

// old /tickets url, checkout is the purchase page now
function Tickets() {
  return <Navigate to="/checkout" replace />
}

export default Tickets