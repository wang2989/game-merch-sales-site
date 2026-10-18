/**
 * @param {{ item: import('../types/item').Item, quantity: number, onQuantityChange: (id: string, qty: number) => void }} props
 */
export default function ItemCard({ item, quantity, onQuantityChange }) {
  const setQty = (value) => {
    const qty = Math.min(item.stock, Math.max(0, parseInt(value, 10) || 0))
    onQuantityChange(item.id, qty)
  }

  // Generate a playful badge based on item ID (Mishmash style)
  const getBadge = () => {
    if (item.id === 'minecraft-hoodie') {
      return { text: '✦ Bestseller', variant: 'sun' }
    }
    if (item.id === 'fortnite-sweater') {
      return { text: '● New Edition', variant: 'teal' }
    }
    if (item.id === 'mario-hat') {
      return { text: '★ Iconic', variant: 'salmon' }
    }
    return { text: '✦ In Demand', variant: 'sun' }
  }

  const badge = getBadge()

  return (
    <article className="item-card">
      <div className="item-card-image-wrapper">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="item-card-image"
          />
        ) : (
          <div
            style={{ width: '100%', height: '100%', background: '#eee' }}
            aria-label="No image"
          />
        )}
        <span className={`item-badge-pill ${badge.variant}`}>{badge.text}</span>
      </div>

      <div className="item-info">
        <h3 className="item-name">{item.name}</h3>
        <div className="item-price-row">
          <span className="item-price">${item.price.toFixed(2)}</span>
          <span className="item-stock">
            <span className="stock-indicator" />
            {item.stock} available
          </span>
        </div>
      </div>

      <div className="item-stepper-row">
        <div className="stepper-capsule">
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
      </div>
    </article>
  )
}
