import { useParams, Link } from 'react-router-dom'
import { useCart, useInventorySync } from '../context/CartContext'

export default function ProductDetail() {
  useInventorySync()
  const { id } = useParams()
  const { itemsById, inventoryStatus, inventoryError, cart, updateCart } = useCart()

  const item = itemsById[id]
  const quantity = cart.buyQuantity?.[id] ?? 0

  const setQty = (value) => {
    if (!item) return
    const qty = Math.min(item.stock, Math.max(0, parseInt(value, 10) || 0))
    updateCart((prev) => ({
      buyQuantity: {
        ...prev.buyQuantity,
        [id]: qty,
      },
    }))
  }

  if (inventoryStatus === 'loading' && !item) {
    return (
      <main className="site-main product-detail-page">
        <div className="site-container">
          <div className="product-detail-loading">
            <p role="status">Loading product details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (inventoryStatus === 'error' && !item) {
    return (
      <main className="site-main product-detail-page">
        <div className="site-container">
          <div className="product-detail-empty">
            <h1 className="section-title">Unable to Load Product</h1>
            <p className="section-tagline">{inventoryError || 'Could not connect to inventory service.'}</p>
            <Link to="/purchase" className="btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
              &larr; Return to Catalog
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!item) {
    return (
      <main className="site-main product-detail-page">
        <div className="site-container">
          <div className="product-detail-empty">
            <h1 className="section-title">Product Not Found</h1>
            <p className="section-tagline">
              The item you are looking for does not exist or may have been retired from the collection.
            </p>
            <Link to="/purchase" className="btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
              &larr; Return to Catalog
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="site-main product-detail-page">
      <div className="site-container">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="product-breadcrumb-nav">
          <Link to="/purchase" className="product-back-link">
            <span aria-hidden="true">&larr;</span>
            <span>Back to Catalog</span>
          </Link>
        </nav>

        {/* 2-Column Editorial Showcase */}
        <div className="product-detail-layout">
          {/* Left: Product Image Box */}
          <div className="product-detail-media">
            <div className="product-detail-image-box">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="product-detail-image"
                />
              ) : (
                <div className="product-detail-fallback">
                  <span>No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Information & Live Purchase Controls */}
          <div className="product-detail-info">
            <div className="product-detail-header">
              <span className="product-category-eyebrow">Relic Listing</span>
              <h1 className="product-detail-name">{item.name}</h1>
              <div className="product-detail-price-stock-row">
                <span className="product-detail-price">${item.price.toFixed(2)}</span>
                <span className={`item-stock ${item.stock > 0 ? '' : 'out-of-stock'}`}>
                  <span className="stock-indicator" />
                  {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            <hr className="product-detail-divider" />

            {/* Description */}
            <div className="product-detail-desc-block">
              <h2 className="product-detail-subheading">About this piece</h2>
              <p className="product-detail-description">
                {item.description ||
                  'Crafted with attention to detail and subtle references, designed for fans who love keeping their favorite virtual worlds close.'}
              </p>
            </div>

            <hr className="product-detail-divider" />

            {/* Live Cart Quantity Stepper */}
            <div className="product-detail-actions">
              <div className="product-stepper-header">
                <span className="product-stepper-label">Quantity in Cart</span>
                {quantity > 0 && (
                  <span className="product-in-cart-pill">
                    ✓ {quantity} in cart (${(quantity * item.price).toFixed(2)})
                  </span>
                )}
              </div>

              <div className="product-stepper-row">
                <div className="stepper-capsule large-stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setQty(quantity - 1)}
                    disabled={quantity <= 0}
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    &minus;
                  </button>
                  <input
                    type="number"
                    min="0"
                    max={item.stock}
                    value={quantity}
                    aria-label={`${item.name} quantity`}
                    onChange={(e) => setQty(e.target.value)}
                    className="stepper-input"
                  />
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setQty(quantity + 1)}
                    disabled={quantity >= item.stock}
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    &#43;
                  </button>
                </div>

                {quantity > 0 && (
                  <Link to="/shoppingCart" className="btn-primary product-view-cart-btn">
                    <span>Go to Cart</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                )}
              </div>

              {item.stock === 0 && (
                <p className="product-sold-out-note">
                  This item is currently out of stock. Check back soon for future restocks.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

