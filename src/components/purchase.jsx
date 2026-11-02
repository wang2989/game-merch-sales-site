import { Link } from 'react-router-dom'
import { useCart, useInventorySync } from '../context/CartContext'
import ItemCard from './ItemCard'

export default function Purchase() {
  useInventorySync()
  const { cart, updateCart, items, inventoryStatus, inventoryError } = useCart()

  const handleQuantityChange = (itemId, qty) => {
    updateCart((prev) => ({ buyQuantity: { ...prev.buyQuantity, [itemId]: qty } }))
  }

  const totalItems = Object.values(cart.buyQuantity || {}).reduce((acc, curr) => acc + curr, 0)
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * (cart.buyQuantity[item.id] ?? 0),
    0,
  )

  return (
    <main className="site-main">
      <div className="site-container">
        {/* Editorial Hero Banner — Mishmash Signature */}
        <section className="editorial-hero">
          <div className="hero-card">
            <div className="hero-content">
              <div className="hero-sticker">
                <span>✦</span>
                <span>The 2026 Collection</span>
              </div>
              <h1 className="hero-title">Creative gear for fans & players.</h1>
              <p className="hero-subtitle">
                Designed with meticulous attention to detail. Minimalist, ethical, and built for long sessions.
              </p>
              <a href="#catalog" className="hero-cta-btn">
                <span>Explore Catalog</span>
                <span aria-hidden="true">&darr;</span>
              </a>
            </div>

            <div className="hero-shapes" aria-hidden="true">
              <div className="shape-circle" />
              <div className="shape-circle yellow" />
              <div className="shape-circle teal" />
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalog" style={{ scrollMarginTop: '96px' }}>
          <div className="catalog-header">
            <div>
              <h2 className="section-title">The Catalog</h2>
              <p className="section-tagline">Showing {items.length} curated gaming staples</p>
            </div>
          </div>

          <div className="product-grid">
            {inventoryStatus === 'loading' && items.length === 0 ? (
              <p role="status">Loading inventory...</p>
            ) : inventoryStatus === 'error' && items.length === 0 ? (
              <p role="alert">Unable to load inventory: {inventoryError}</p>
            ) : (
              items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  quantity={cart.buyQuantity[item.id] ?? 0}
                  onQuantityChange={handleQuantityChange}
                />
              ))
            )}
          </div>

          {/* Cart Status Bar */}
          <div className="catalog-summary-bar">
            <p className="summary-bar-text">
              Total items in cart: <strong>{totalItems}</strong> (${totalPrice.toFixed(2)})
            </p>
            <Link
              to="/shoppingCart"
              className="btn-primary"
            >
              <span>View Bag & Checkout</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
