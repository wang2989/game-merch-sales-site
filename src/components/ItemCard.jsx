/**
 * @param {{ item: import('../types/item').Item, quantity: number, onQuantityChange: (id: string, qty: number) => void }} props
 */
export default function ItemCard({ item, quantity, onQuantityChange }) {
  const setQty = (value) => {
    const qty = Math.min(item.stock, Math.max(0, parseInt(value, 10) || 0))
    onQuantityChange(item.id, qty)
  }

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 12,
        width: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {item.image ? (
        <img className="product-image" src={item.image} alt={item.name} />
      ) : (
        <div className="product-image-placeholder" aria-label="No image" />
      )}
      <strong>{item.name}</strong>
      <span>${item.price.toFixed(2)}</span>
      <span>{item.stock} available</span>
      <div>
        <button className="button-secondary" type="button" onClick={() => setQty(quantity - 1)} disabled={quantity <= 0}>
          -
        </button>
        <input
          type="number"
          min="0"
          max={item.stock}
          value={quantity}
          aria-label={`${item.name} quantity`}
          onChange={(e) => setQty(e.target.value)}
          style={{ width: 60, textAlign: 'center' }}
        />
        <button className="button-secondary" type="button" onClick={() => setQty(quantity + 1)} disabled={quantity >= item.stock}>
          +
        </button>
      </div>
    </div>
  )
}
