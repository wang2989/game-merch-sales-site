import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { itemsById } from '../data/items'

export default function Confirmation() {
  const { cart, resetCart } = useCart()
  const navigate = useNavigate()

  const confirmationNumber = 'ORD-2026-X8892'

  const orderItems = Object.entries(cart.buyQuantity || {})
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = itemsById[id] || { name: 'Item', price: 0 }
      return {
        ...item,
        quantity: qty,
        lineTotal: item.price * qty,
      }
    })

  const totalCost = orderItems.reduce((acc, item) => acc + item.lineTotal, 0)

  const handleStartNewOrder = () => {
    resetCart()
    navigate('/purchase')
  }

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ fontSize: '3rem', color: '#28a745' }}>✓</div>
  <h1 style={{ lineHeight: '1.25', margin: '0.5rem 0 1rem' }}>
  Thank You for Your Order{cart.name ? `, ${cart.name}` : ''}!
</h1>
      <p style={{ color: '#555', fontSize: '1.1rem' }}>
        Your transaction has been processed successfully.
      </p>

      {/* Confirmation Number */}
      <div
        style={{
          display: 'inline-block',
          margin: '1.5rem 0',
          padding: '1rem 2rem',
          backgroundColor: '#f4f6f8',
          border: '1px dashed #0070f3',
          borderRadius: 8,
        }}
      >
        <span style={{ fontSize: '0.9rem', color: '#666', display: 'block' }}>Confirmation Number</span>
        <strong style={{ fontSize: '1.4rem', color: '#111', letterSpacing: '1px' }}>
          {confirmationNumber}
        </strong>
      </div>

      {/* Final Order Summary */}
      <div
        style={{
          textAlign: 'left',
          marginTop: '1.5rem',
          padding: '1.2rem',
          border: '1px solid #e0e0e0',
          borderRadius: 8,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Final Order Summary</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {orderItems.map((item) => (
            <li
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <span>
                {item.name} &times; {item.quantity}
              </span>
              <span>${item.lineTotal.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontWeight: 'bold' }}>
          <span>Total Paid:</span>
          <span>${totalCost.toFixed(2)}</span>
        </div>
        {cart.city && (
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
            Shipping to: {cart.address_1}, {cart.city}, {cart.state} {cart.zip}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleStartNewOrder}
        style={{
          marginTop: '2rem',
          padding: '12px 24px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Return to Catalog
      </button>
    </div>
  )
}