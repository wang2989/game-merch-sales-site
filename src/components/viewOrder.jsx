import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CheckoutStepper from './CheckoutStepper'

export default function ViewOrder() {
  const { cart, itemsById } = useCart()
  const navigate = useNavigate()

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

  const totalCost = orderItems.reduce((acc, item) => acc + item.lineTotal, 0)

  const rawCard = cart.credit_card_number || ''
  const maskedCard = rawCard.length >= 4
    ? `•••• •••• •••• ${rawCard.slice(-4)}`
    : rawCard || 'Not provided'

  return (
    <main className="site-main">
      <div className="site-container">
        <CheckoutStepper currentStep={4} />

        <div className="review-layout">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 className="section-title">Review & Confirm Your Order</h1>
            <p className="section-tagline">
              Please review your items, delivery destination, and payment method before placing your order.
            </p>
          </div>

          {/* Items Summary Section */}
          <section className="review-section-card">
            <h2 className="review-card-header">Items Ordered</h2>
            {orderItems.length === 0 ? (
              <p style={{ color: 'var(--color-ink-secondary)', fontSize: 14 }}>No items in cart.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="review-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="review-item-cell">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="review-thumb"
                              />
                            ) : (
                              <div
                                className="review-thumb"
                                style={{ background: '#eee' }}
                              />
                            )}
                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                          </div>
                        </td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          ${item.lineTotal.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" style={{ padding: '20px 12px 10px', fontWeight: 700, textAlign: 'right', fontSize: 16 }}>
                        Total Cost:
                      </td>
                      <td style={{ padding: '20px 12px 10px', fontWeight: 800, textAlign: 'right', fontSize: '1.25rem', color: 'var(--color-ink)' }}>
                        ${totalCost.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </section>

          {/* Shipping & Payment Details Cards */}
          <div className="review-detail-grid" style={{ marginBottom: 32 }}>
            {/* Shipping Box */}
            <div className="review-detail-box">
              <div className="review-detail-title">Shipping Details</div>
              <p className="review-detail-line"><strong>Recipient:</strong> {cart.name || 'N/A'}</p>
              <p className="review-detail-line"><strong>Address 1:</strong> {cart.address_1 || 'N/A'}</p>
              {cart.address_2 && (
                <p className="review-detail-line"><strong>Address 2:</strong> {cart.address_2}</p>
              )}
              <p className="review-detail-line">
                <strong>City, State, Zip:</strong>{' '}
                {[cart.city, cart.state, cart.zip].filter(Boolean).join(', ') || 'N/A'}
              </p>
            </div>

            {/* Payment Box */}
            <div className="review-detail-box">
              <div className="review-detail-title">Payment Information</div>
              <p className="review-detail-line"><strong>Cardholder:</strong> {cart.card_holder_name || 'N/A'}</p>
              <p className="review-detail-line"><strong>Card Number:</strong> {maskedCard}</p>
              <p className="review-detail-line"><strong>Expiration Date:</strong> {cart.expir_date || 'N/A'}</p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigate('/paymentEntry')}
              className="btn-secondary"
            >
              Back to Payment
            </button>
            <button
              type="button"
              onClick={() => navigate('/confirmation')}
              disabled={orderItems.length === 0}
              className="btn-primary"
              style={{
                padding: '12px 28px',
                fontSize: 15,
              }}
            >
              Confirm & Place Order
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}