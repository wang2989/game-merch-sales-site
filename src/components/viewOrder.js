import { createElement } from 'react'
import { useCart } from '../context/CartContext'

export default function ViewOrder() {
  const { cart } = useCart()
  const totalItems = cart.buyQuantity.reduce((acc, curr) => acc + curr, 0)

  return createElement(
    'div',
    null,
    createElement('h1', null, 'View Order'),
    createElement('p', null, `Total items: ${totalItems}`),
    createElement(
      'ul',
      null,
      cart.buyQuantity.map((qty, index) =>
        createElement('li', { key: index }, `Item ${index + 1}: ${qty}`),
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
