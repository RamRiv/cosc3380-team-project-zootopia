import { useState } from 'react'
import { Navigate } from 'react-router'
import { getLoggedInCustomer } from '../customerAuth.js'
import { TICKETS } from '../zooInfo.js'

// buy tickets. customers have to be logged in
// TEMP: the order isn't saved anywhere yet
function Tickets() {
  const customer = getLoggedInCustomer()

  // how many of each type, like { Adult: 2, Child: 1 }
  const [quantities, setQuantities] = useState({})
  const [visitDate, setVisitDate] = useState('')
  const [message, setMessage] = useState('')

  // not logged in -> send to customer login
  // (has to be after the useStates, React needs those to always run)
  if (!customer) {
    return <Navigate to="/customer-login" replace />
  }

  function changeQty(type, value) {
    setQuantities({ ...quantities, [type]: Number(value) })
  }

  // add up price x how many for each type
  let total = 0
  for (const t of TICKETS) {
    total += t.price * (quantities[t.type] || 0)
  }

  function handleBuy(e) {
    e.preventDefault()

    if (!visitDate) {
      setMessage('Please pick a visit date')
      return
    }
    if (total === 0) {
      setMessage('Please pick at least one ticket')
      return
    }

    // later: send the order to the backend
    // (makes 1 transaction row + 1 line item per ticket type)
    setMessage('Order placed! Total: $' + total.toFixed(2))
  }

  return (
    <div className="home">
      <h1>Buy Tickets</h1>
      <p>Logged in as {customer.firstName} {customer.lastName}</p>

      <form onSubmit={handleBuy}>
        <label>Visit date </label>
        <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />

        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Price</th>
              <th>How many</th>
            </tr>
          </thead>
          <tbody>
            {TICKETS.map((t) => (
              <tr key={t.type}>
                <td>{t.type}</td>
                <td>${t.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={quantities[t.type] || 0}
                    onChange={(e) => changeQty(t.type, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p><strong>Total: ${total.toFixed(2)}</strong></p>
        <button type="submit">Buy</button>
        {message ? <p>{message}</p> : null}
      </form>
    </div>
  )
}

export default Tickets