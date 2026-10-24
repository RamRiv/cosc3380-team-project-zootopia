import { useState } from 'react'
import { Navigate } from 'react-router'
import { getLoggedInCustomer } from '../customerAuth.js'
import { TICKETS } from '../zooInfo.js'

// buy tickets. customers have to be logged in
// one ticket per order: pick adult, child, or senior
// TEMP: the order isn't saved anywhere yet
function Tickets() {
  const customer = getLoggedInCustomer()

  // which ticket type is picked, like 'Adult' ('' = none yet)
  const [selectedType, setSelectedType] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [message, setMessage] = useState('')

  // not logged in -> send to customer login
  if (!customer) {
    return <Navigate to="/customer-login" replace />
  }

  // find the full ticket info for what's picked (undefined if nothing picked)
  const selectedTicket = TICKETS.find((t) => t.type === selectedType)

  function handleBuy(e) {
    e.preventDefault()

    if (!visitDate) {
      setMessage('Please pick a visit date')
      return
    }
    if (!selectedTicket) {
      setMessage('Please pick a ticket type')
      return
    }

    // later: send the order to the backend
    // (1 transaction row + 1 line item for this ticket)
    setMessage(
      'Order placed! 1 ' + selectedTicket.type + ' ticket for ' + visitDate +
      ', total $' + selectedTicket.price.toFixed(2)
    )
  }

  return (
    <div className="home">
      <h1>Buy Tickets</h1>
      <p>Logged in as {customer.firstName} {customer.lastName}</p>

      <form onSubmit={handleBuy}>
        <label>Visit date </label>
        <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />

        <h3>Ticket type</h3>
        {/* same name on every radio = only one can be picked */}
        {TICKETS.map((t) => (
          <label key={t.type} className="ticket-option">
            <input
              type="radio"
              name="ticketType"
              value={t.type}
              checked={selectedType === t.type}
              onChange={(e) => setSelectedType(e.target.value)}
            />
            {t.type} ${t.price.toFixed(2)}
          </label>
        ))}

        <p>
          <strong>
            Total: ${selectedTicket ? selectedTicket.price.toFixed(2) : '0.00'}
          </strong>
        </p>
        <button type="submit">Buy</button>
        {message ? <p>{message}</p> : null}
      </form>
    </div>
  )
}

export default Tickets