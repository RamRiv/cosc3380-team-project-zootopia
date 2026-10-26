import { useEffect, useState } from 'react'
import { getLoggedInCustomer } from '../customerAuth.js'
import { TICKETS } from '../zooInfo.js'

// one purchase: ticket required, products optional (same transaction)
function Checkout() {
  const customer = getLoggedInCustomer()

  const [selectedType, setSelectedType] = useState('')
  const [products, setProducts] = useState([])
  const [qtyById, setQtyById] = useState({})
  const [message, setMessage] = useState('')

  const selectedTicket = TICKETS.find((t) => t.type === selectedType)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        if (response.ok) {
          setProducts(data)
        }
      } catch (err) {
        // keep empty list if products fail to load
      }
    }
    loadProducts()
  }, [])

  function handleQtyChange(productId, value) {
    setQtyById({ ...qtyById, [productId]: value })
  }

  const selectedProducts = products
    .map((p) => ({
      productId: p.ProductID,
      quantity: parseInt(qtyById[p.ProductID], 10) || 0,
      price: Number(p.Price),
    }))
    .filter((p) => p.quantity > 0)

  const ticketTotal = selectedTicket ? selectedTicket.price : 0
  const productsTotal = selectedProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  )
  const total = ticketTotal + productsTotal

  async function handleBuy(e) {
    e.preventDefault()

    if (!selectedTicket) {
      setMessage('Please pick a ticket type')
      return
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.customerId,
          paymentType: 'Card',
          ticketType: selectedTicket.type,
          products: selectedProducts.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
          })),
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error || 'Could not complete purchase')
        return
      }

      setMessage('Purchase complete! Total $' + total.toFixed(2))
      setSelectedType('')
      setQtyById({})

      const refresh = await fetch('/api/products')
      const fresh = await refresh.json()
      if (refresh.ok) {
        setProducts(fresh)
      }
    } catch (err) {
      setMessage('Could not connect to the server')
    }
  }

  return (
    <div>
      <h1>Checkout</h1>

      <form onSubmit={handleBuy}>
        <h3>Ticket</h3>
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

        <h3>Products</h3>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>In Stock</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.ProductID}>
                  <td>{p.Name}</td>
                  <td>${Number(p.Price).toFixed(2)}</td>
                  <td>{p.QuantityInStock}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={qtyById[p.ProductID] ?? ''}
                      onChange={(e) =>
                        handleQtyChange(p.ProductID, e.target.value)
                      }
                      style={{ width: '60px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p>
          <strong>Total: ${total.toFixed(2)}</strong>
          {selectedTicket ? (
            <span>
              {' '}
              (ticket ${ticketTotal.toFixed(2)}
              {productsTotal > 0
                ? ' + products $' + productsTotal.toFixed(2)
                : ''}
              )
            </span>
          ) : null}
        </p>
        <button type="submit">Complete purchase</button>
        {message ? <p>{message}</p> : null}
      </form>
    </div>
  )
}

export default Checkout
