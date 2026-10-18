import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { itemsById } from '../data/items'

export default function ViewOrder() {
  const { cart } = useCart()
  const navigate = useNavigate()

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

  const rawCard = cart.credit_card_number || ''
  const maskedCard = rawCard.length >= 4 
    ? `•••• •••• •••• ${rawCard.slice(-4)}` 
    : rawCard || 'Not provided'

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1.5rem' }}>
      <h1>Review & Confirm Your Order</h1>
      <p>Please review your order details, shipping address, and payment method below.</p>

      {/* Items Summary Table */}
      <section style={{ marginTop: '1.5rem' }}>
        <h3>Items Ordered</h3>
        {orderItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Item</th>
                <th style={{ padding: '8px' }}>Price</th>
                <th style={{ padding: '8px' }}>Qty</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} 
                      />
                    )}
                    <span>{item.name}</span>
                  </td>
                  <td style={{ padding: '8px' }}>${item.price.toFixed(2)}</td>
                  <td style={{ padding: '8px' }}>{item.quantity}</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>${item.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ padding: '12px 8px', fontWeight: 'bold', textAlign: 'right' }}>
                  Total Cost:
                </td>
                <td style={{ padding: '12px 8px', fontWeight: 'bold', textAlign: 'right' }}>
                  ${totalCost.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </section>

      {/* Shipping Details */}
      <section style={{ marginTop: '2rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 8 }}>
        <h3>Shipping Details</h3>
        <p><strong>Recipient Name:</strong> {cart.name || 'N/A'}</p>
        <p><strong>Address Line 1:</strong> {cart.address_1 || 'N/A'}</p>
        {cart.address_2 && <p><strong>Address Line 2:</strong> {cart.address_2}</p>}
        <p>
          <strong>City, State, Zip:</strong>{' '}
          {[cart.city, cart.state, cart.zip].filter(Boolean).join(', ') || 'N/A'}
        </p>
      </section>

      {/* Payment Details */}
      <section style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 8 }}>
        <h3>Payment Information</h3>
        <p><strong>Cardholder Name:</strong> {cart.card_holder_name || 'N/A'}</p>
        <p><strong>Card Number:</strong> {maskedCard}</p>
        <p><strong>Expiration Date:</strong> {cart.expir_date || 'N/A'}</p>
      </section>

      {/* Actions */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => navigate('/paymentEntry')}
          className="button-secondary"
        >
          Back to Payment
        </button>
        <button
          type="button"
          onClick={() => navigate('/confirmation')}
          disabled={orderItems.length === 0}
        >
          Confirm & Place Order
        </button>
      </div>
    </div>
  )
}