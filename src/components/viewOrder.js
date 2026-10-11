import { createElement } from 'react'
import { useCart } from '../context/CartContext'
import { itemsById } from '../data/items'

export default function ViewOrder() {
  const { cart } = useCart()
  const totalItems = Object.values(cart.buyQuantity).reduce((acc, curr) => acc + curr, 0)

  return createElement(
    'div',
    null,
    createElement('h1', null, 'View Order'),
    createElement('p', null, `Total items: ${totalItems}`),
    createElement(
      'ul',
      null,
      Object.entries(cart.buyQuantity).map(([itemId, qty]) =>
        createElement('li', { key: itemId }, `${itemsById[itemId]?.name ?? itemId}: ${qty}`),
      ),
    ),
    createElement(
      'div',
      null,
      createElement('p', null, `Name: ${cart.name || 'Not provided'}`),
      createElement('p', null, `Address: ${cart.address_1 || 'Not provided'}`),
      cart.address_2 ? createElement('p', null, `Address 2: ${cart.address_2}`) : null,
      createElement('p', null, `City: ${cart.city || 'Not provided'}`),
      createElement('p', null, `State: ${cart.state || 'Not provided'}`),
      createElement('p', null, `Zip: ${cart.zip || 'Not provided'}`),
      createElement('p', null, `Credit Card: ${cart.credit_card_numer || 'Not provided'}`),
    ),
  )
}
