import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { cart } = useCart()
  const hasItems = Object.values(cart.buyQuantity).some((qty) => qty > 0)

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px' }}>
      <Link to="/purchase">Catalog</Link>
      <Link
        to="/shoppingCart"
        aria-label={hasItems ? 'Shopping cart (has items)' : 'Shopping cart (empty)'}
        style={{ position: 'relative', display: 'inline-flex' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
        </svg>
        {hasItems && (
          <span
            data-testid="cart-badge"
            style={{
              position: 'absolute',
              top: -4,
              right: -6,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#e53935',
              border: '2px solid #fff',
            }}
          />
        )}
      </Link>
    </nav>
  )
}
