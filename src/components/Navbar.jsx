import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { cart } = useCart()
  const location = useLocation()
  const totalItemCount = Object.values(cart.buyQuantity || {}).reduce((sum, qty) => sum + qty, 0)
  const hasItems = totalItemCount > 0

  return (
    <header>
      {/* Top Announcement Ribbon */}
      <aside className="announcement-bar">
        <div className="announcement-content">
          <span className="announcement-item">✦ More coming soon</span>
          <span className="announcement-sep" aria-hidden="true">|</span>
          <span className="announcement-item">Exclusive offers today</span>
        </div>
      </aside>

      {/* Main Navigation Bar */}
      <nav className="site-navbar">
        <div className="site-container navbar-inner">
          <Link to="/purchase" className="navbar-brand">
            <span>relic plaza</span>
            <span className="brand-mark">®</span>
          </Link>

<div className="navbar-nav">
  <Link
    to="/purchase"
    className={`nav-link ${location.pathname === '/purchase' || location.pathname === '/' ? 'active' : ''}`}
  >
    Catalog
  </Link>
  <Link
    to="/contact"
    className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
  >
    Contact
  </Link>
</div>

          <div className="navbar-actions">
            <Link
              to="/shoppingCart"
              className="cart-icon-btn"
              aria-label={hasItems ? 'Shopping cart (has items)' : 'Shopping cart (empty)'}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Bag</span>
              {hasItems && (
                <span
                  data-testid="cart-badge"
                  className="cart-counter-pill"
                >
                  {totalItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
