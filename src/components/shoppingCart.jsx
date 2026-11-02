import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart, useInventorySync } from '../context/CartContext'
import CheckoutStepper from './CheckoutStepper'

export default function ShoppingCart() {
  useInventorySync()
  const navigate = useNavigate()
  const { cart, updateCart, resetCart, itemsById } = useCart()

  const handleQuantityChange = (itemId, value) => {
    const max = itemsById[itemId]?.stock ?? Infinity
    const qty = Math.min(max, Math.max(0, parseInt(value, 10) || 0))
    updateCart((prev) => ({ buyQuantity: { ...prev.buyQuantity, [itemId]: qty } }))
    if (qty > 0) {
      setErrorMessage('')
    }
  }

  // Items shown on this page are fixed at mount, so one reduced to 0 stays visible until the page is revisited
  const [visibleIds, setVisibleIds] = useState(() =>
    Object.keys(cart.buyQuantity || {}).filter((id) => (cart.buyQuantity[id] ?? 0) > 0),
  )
  const [orderEmail, setOrderEmail] = useState(() => cart.email || '')
  const [errorMessage, setErrorMessage] = useState('')

  const handleEmailChange = (e) => {
    const val = e.target.value
    setOrderEmail(val)
    updateCart({ email: val })
    setErrorMessage('')
  }

  const handleDelete = (itemId) => {
    handleQuantityChange(itemId, 0)
    setVisibleIds((ids) => ids.filter((id) => id !== itemId))
  }

  const handleClear = () => {
    resetCart()
    setVisibleIds([])
    setOrderEmail('')
    setErrorMessage('')
  }

  const handleCheckout = () => {
    if (totalItems === 0) {
      setErrorMessage('Cannot checkout with an empty cart')
      return
    }

    const trimmedEmail = orderEmail.trim()
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address (or leave it blank).')
      return
    }

    const overStockId = visibleIds.find((id) => {
      const item = itemsById[id]
      const qty = cart.buyQuantity[id] ?? 0
      return item && qty > item.stock
    })

    if (overStockId) {
      const item = itemsById[overStockId]
      setErrorMessage(
        item.stock <= 0
          ? `"${item.name}" is now out of stock. Please remove it to proceed.`
          : `Requested quantity for "${item.name}" exceeds available stock (${item.stock} available). Please adjust your cart.`
      )
      return
    }

    updateCart({ email: trimmedEmail })
    setErrorMessage('')
    navigate('/paymentEntry')
  }

  const totalItems = Object.values(cart.buyQuantity || {}).reduce((acc, curr) => acc + curr, 0)
  const subtotal = visibleIds.reduce((acc, id) => {
    const item = itemsById[id]
    const qty = cart.buyQuantity[id] ?? 0
    return acc + (item ? item.price * qty : 0)
  }, 0)

  const isFreeShipping = subtotal >= 50
  const freeShippingThreshold = 50

  return (
    <main className="site-main">
      <div className="site-container">
        <CheckoutStepper currentStep={1} />

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 className="section-title">Shopping Cart</h1>
          <p className="section-tagline">Total items: {totalItems}</p>
        </div>

        {visibleIds.length === 0 ? (
          <div className="empty-cart-state">
            <svg
              className="empty-cart-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Your bag is empty</h2>
            <p style={{ color: 'var(--color-ink-secondary)', marginBottom: 24, fontSize: 14 }}>
              Explore our creative gaming collection to find everyday tools and apparel.
            </p>
            <Link to="/purchase" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-page-layout">
            {/* Items List */}
            <div className="cart-items-card">
              {visibleIds.map((itemId) => {
                const qty = cart.buyQuantity[itemId] ?? 0
                const item = itemsById[itemId]
                const max = item?.stock ?? Infinity

                return (
                  <div key={itemId} className="cart-item-row">
                    <div className="cart-item-info-group">
                      {item?.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-thumb"
                        />
                      ) : (
                        <div
                          className="cart-item-thumb"
                          style={{ background: '#eee' }}
                          aria-label="No image"
                        />
                      )}
                      <div className="cart-item-details">
                        <strong className="cart-item-name">{item?.name ?? itemId}</strong>
                        <span className="cart-item-unit-price">
                          ${(item?.price ?? 0).toFixed(2)} each
                        </span>
                        {item && qty > item.stock && (
                          <span style={{ color: 'var(--color-danger, #dc2626)', fontSize: '12px', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                            {item.stock <= 0 ? 'Out of stock' : `Only ${item.stock} left in stock`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="cart-item-controls">
                      <div className="stepper-capsule" style={{ width: 'auto' }}>
                        <button
                          type="button"
                          aria-label={`Decrease ${item?.name ?? itemId} quantity`}
                          disabled={qty <= 0}
                          onClick={() => handleQuantityChange(itemId, qty - 1)}
                          className="stepper-btn"
                        >
                          &minus;
                        </button>
                        <input
                          id={`cart-item-${itemId}`}
                          type="number"
                          min="0"
                          max={item?.stock}
                          value={qty}
                          aria-label={`${item?.name ?? itemId} quantity`}
                          className="stepper-input"
                          onChange={(e) => handleQuantityChange(itemId, e.target.value)}
                        />
                        <button
                          type="button"
                          aria-label={`Increase ${item?.name ?? itemId} quantity`}
                          disabled={qty >= max}
                          onClick={() => handleQuantityChange(itemId, qty + 1)}
                          className="stepper-btn"
                        >
                          &#43;
                        </button>
                      </div>

                      <button
                        type="button"
                        aria-label={`Remove ${item?.name ?? itemId} from cart`}
                        title="Remove"
                        onClick={() => handleDelete(itemId)}
                        className="cart-trash-btn"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Summary Sidebar */}
            <aside className="order-summary-card">
              <h2 className="summary-heading">Order Summary</h2>

              {isFreeShipping ? (
                <div className="free-shipping-pill">
                  <span>✓</span>
                  <span>You've unlocked Free Standard Shipping!</span>
                </div>
              ) : (
                <div className="free-shipping-pill" style={{ background: '#fef3c7', borderColor: '#fde68a', color: '#92400e' }}>
                  <span>✦</span>
                  <span>Add ${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping!</span>
                </div>
              )}

              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span>{isFreeShipping ? 'FREE' : '$5.00'}</span>
              </div>
              <div className="summary-row">
                <span>Estimated Tax</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-row total-row">
                <span>Estimated Total</span>
                <span>${(subtotal + (isFreeShipping || subtotal === 0 ? 0 : 5)).toFixed(2)}</span>
              </div>

              {/* Optional Order Contact Email */}
              <div style={{ marginTop: 20, marginBottom: 16 }}>
                <label
                  htmlFor="cart-order-email"
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--color-ink-secondary)',
                    marginBottom: 6,
                  }}
                >
                  Contact Email (Optional)
                </label>
                <input
                  id="cart-order-email"
                  type="email"
                  value={orderEmail}
                  onChange={handleEmailChange}
                  placeholder="player@example.com"
                  className="form-input"
                  style={{ width: '100%', fontSize: 14, padding: '10px 14px' }}
                />
                <span style={{ display: 'block', fontSize: 11, color: 'var(--color-ink-secondary)', marginTop: 4 }}>
                  For order confirmation and receipt
                </span>
              </div>

              {errorMessage && (
                <p
                  className="form-alert-error"
                  role="alert"
                  data-testid="empty-cart-error"
                  style={{ marginBottom: 16 }}
                >
                  {errorMessage}
                </p>
              )}

              <div className="cart-actions">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px 20px', fontSize: '15px' }}
                >
                  <span>Checkout</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="btn-secondary"
                  style={{ width: '100%' }}
                >
                  Clear Cart
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
