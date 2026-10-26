import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Confirmation() {
  const { cart, resetCart, itemsById, orderConfirmation } = useCart()
  const navigate = useNavigate()

  const confirmationNumber = orderConfirmation?.confirmationNumber

  const orderItems = Object.entries(cart.buyQuantity || {})
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = itemsById[id] || { name: 'Item', price: 0 }
      return {
        ...item,
        quantity: qty,
        lineTotal: item.price * qty,
      }
    })

  const totalCost = orderConfirmation?.totalAmount ??
    orderItems.reduce((acc, item) => acc + item.lineTotal, 0)

  const handleStartNewOrder = () => {
    resetCart()
    navigate('/purchase')
  }

  return (
    <main className="site-main">
      <div className="site-container">
        <div className="confirmation-layout">
          <div className="confirmation-card">
            <div className="confirmation-icon-circle" aria-hidden="true">
              ✓
            </div>

            <h1 className="form-title" style={{ fontSize: '2rem', marginBottom: 8 }}>
              Thank You for Your Order{cart.name ? `, ${cart.name}` : ''}!
            </h1>
            <p className="form-description">
              Your transaction has been processed successfully. A confirmation receipt has been sent.
            </p>

            {/* Confirmation Voucher Badge — Mishmash Style */}
            <div className="voucher-pill">
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-secondary)', display: 'block', marginBottom: 4 }}>
                Confirmation Reference
              </span>
              <span className="voucher-number">{confirmationNumber}</span>
            </div>

            {/* Final Order Summary */}
            <div
              style={{
                textAlign: 'left',
                marginTop: 24,
                padding: 24,
                backgroundColor: '#faf9f6',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--color-ink)' }}>
                Final Order Summary
              </h2>
              <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {orderItems.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: 8,
                      borderBottom: '1px solid var(--color-border-subtle)',
                      fontSize: 14,
                    }}
                  >
                    <span>
                      <strong>{item.name}</strong> &times; {item.quantity}
                    </span>
                    <span style={{ fontWeight: 600 }}>${item.lineTotal.toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 16,
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                <span>Total Paid:</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>

              {cart.city && (
                <p style={{ fontSize: 13, color: 'var(--color-ink-secondary)', marginTop: 16, lineHeight: 1.4 }}>
                  <strong>Delivering to:</strong> {cart.address_1}, {cart.city}, {cart.state} {cart.zip}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleStartNewOrder}
              className="btn-primary"
              style={{
                marginTop: 32,
                padding: '14px 32px',
                fontSize: 15,
              }}
            >
              Return to Catalog
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}