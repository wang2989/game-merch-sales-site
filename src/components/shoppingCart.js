import { createElement } from 'react'
import { useCart } from '../context/CartContext'
import { itemsById } from '../data/items'

export default function ShoppingCart() {
  const { cart, updateCart, resetCart } = useCart()

  const handleQuantityChange = (itemId, value) => {
    const qty = Math.max(0, parseInt(value, 10) || 0)
    updateCart((prev) => ({ buyQuantity: { ...prev.buyQuantity, [itemId]: qty } }))
  }

  const totalItems = Object.values(cart.buyQuantity).reduce((acc, curr) => acc + curr, 0)

  return createElement(
    'div',
    null,
    createElement('h1', null, 'Shopping Cart'),
    createElement('p', null, `Total items: ${totalItems}`),
    createElement(
      'div',
      null,
      Object.entries(cart.buyQuantity).map(([itemId, qty]) =>
        createElement(
          'div',
          { key: itemId, style: { margin: '8px 0' } },
          createElement('label', { htmlFor: `cart-item-${itemId}` }, `${itemsById[itemId]?.name ?? itemId}: `),
          createElement('input', {
            id: `cart-item-${itemId}`,
            type: 'number',
            min: '0',
            value: qty,
            onChange: (e) => handleQuantityChange(itemId, e.target.value),
          }),
        ),
      ),
    ),
    createElement(
      'button',
      { type: 'button', onClick: resetCart, style: { marginTop: '12px' } },
      'Clear Cart',
    ),
  )
}
