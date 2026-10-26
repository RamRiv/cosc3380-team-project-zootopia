import { Navigate } from 'react-router'

// old /tickets URL — checkout is the one purchase page now
function Tickets() {
  return <Navigate to="/checkout" replace />
}

export default Tickets
