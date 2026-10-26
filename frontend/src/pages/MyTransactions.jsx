import { useEffect, useState } from 'react'
import { getLoggedInCustomer } from '../customerAuth.js'

// shows this customer's past purchases
function MyTransactions() {
  const customer = getLoggedInCustomer()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch(
          '/api/my/transactions?customerId=' + customer.customerId
        )
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Could not load transactions')
          return
        }

        setOrders(data)
      } catch (err) {
        setError('Could not connect to the server')
      }
    }

    loadOrders()
  }, [customer.customerId])

  return (
    <div>
      <h1>My Transactions</h1>
      <p>Username: {customer.username}</p>
      <p>Email: {customer.email || '—'}</p>

      {error ? <p className="error">{error}</p> : null}

      {orders.length === 0 && !error ? (
        <p>No purchases yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Ticket</th>
              <th>Ticket Price</th>
              <th>Products</th>
              <th>Payment</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.transactionId}>
                <td>{String(order.date).slice(0, 10)}</td>
                <td>{order.ticket ? order.ticket.type : '—'}</td>
                <td>
                  {order.ticket
                    ? '$' + Number(order.ticket.unitPrice).toFixed(2)
                    : '—'}
                </td>
                <td>
                  {order.products.length === 0
                    ? '—'
                    : order.products
                        .map((p) => p.ProductName + ' x' + p.Quantity)
                        .join(', ')}
                </td>
                <td>{order.paymentType}</td>
                <td>${Number(order.totalAmount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default MyTransactions