import { createElement } from 'react'
import { useCart } from '../context/CartContext'

export default function Purchase() {
  const { cart, updateCart } = useCart()

  const handleQuantityChange = (index, value) => {
    const qty = Math.max(0, parseInt(value, 10) || 0)
    const newBuyQuantity = [...cart.buyQuantity]
    newBuyQuantity[index] = qty
    updateCart({ buyQuantity: newBuyQuantity })
  }

  const totalItems = cart.buyQuantity.reduce((acc, curr) => acc + curr, 0)

  return createElement(
    'div',
    null,
    createElement('h1', null, 'Purchase'),
    createElement('p', null, 'Select quantities for items:'),
    createElement(
      'div',
      null,
      cart.buyQuantity.map((qty, index) =>
        createElement(
          'div',
          { key: index, style: { margin: '8px 0' } },
          createElement('label', { htmlFor: `item-${index}` }, `Item ${index + 1}: `),
          createElement('input', {
            id: `item-${index}`,
            type: 'number',
            min: '0',
            value: qty,
            onChange: (e) => handleQuantityChange(index, e.target.value),
          }),
        ),
      ),
    ),
    createElement('p', null, `Total items in cart: ${totalItems}`),
  )
}
