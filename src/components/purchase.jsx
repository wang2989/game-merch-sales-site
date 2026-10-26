import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ItemCard from './ItemCard'

export default function Purchase() {
  const { cart, updateCart, items, inventoryStatus, inventoryError } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handleQuantityChange = (itemId, qty) => {
    updateCart((prev) => ({ buyQuantity: { ...prev.buyQuantity, [itemId]: qty } }))
  }

  const totalItems = Object.values(cart.buyQuantity || {}).reduce((acc, curr) => acc + curr, 0)
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * (cart.buyQuantity[item.id] ?? 0),
    0,
  )

  const categories = [
    { id: 'all', label: 'All Essentials' },
    { id: 'apparel', label: 'Hoodies & Sweaters' },
    { id: 'tees', label: 'Tees & Caps' },
  ]

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'apparel') {
      return item.id.includes('hoodie') || item.id.includes('sweater')
    }
    if (selectedCategory === 'tees') {
      return item.id.includes('shirt') || item.id.includes('hat')
    }
    return true
  })

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
              <h1 className="hero-title">Creative gear for serious players.</h1>
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
              <p className="section-tagline">Showing {filteredItems.length} curated gaming staples</p>
            </div>

            <div className="filter-pills" role="tablist" aria-label="Category filter">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  role="tab"
                  aria-selected={selectedCategory === cat.id}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="product-grid">
            {inventoryStatus === 'loading' ? (
              <p role="status">Loading inventory...</p>
            ) : inventoryStatus === 'error' ? (
              <p role="alert">Unable to load inventory: {inventoryError}</p>
            ) : (
              filteredItems.map((item) => (
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
