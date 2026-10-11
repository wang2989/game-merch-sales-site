import { createElement } from 'react'
import { useCart } from '../context/CartContext'

export default function Confirmation() {
  const { cart } = useCart()
  const totalItems = cart.buyQuantity.reduce((acc, curr) => acc + curr, 0)

  return createElement(
    'div',
    null,
    createElement('h1', null, 'Confirmation'),
    createElement('p', null, 'Order Confirmation'),
    createElement('p', null, `Total items ordered: ${totalItems}`),
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
      createElement('p', null, `Recipient: ${cart.name || 'Not provided'}`),
      createElement('p', null, `Shipping Address: ${cart.address_1 || 'Not provided'}`),
      cart.address_2 ? createElement('p', null, `Address 2: ${cart.address_2}`) : null,
      createElement('p', null, `City: ${cart.city || 'Not provided'}`),
      createElement('p', null, `State: ${cart.state || 'Not provided'}`),
      createElement('p', null, `Zip: ${cart.zip || 'Not provided'}`),
      createElement('p', null, `Card Holder: ${cart.card_holder_name || 'Not provided'}`),
      createElement(
        'p',
        null,
        `Credit Card: ${cart.credit_card_numer ? `****${cart.credit_card_numer.slice(-4)}` : 'Not provided'}`,
      ),
      createElement('p', null, `Exp Date: ${cart.expir_date || 'Not provided'}`),
    ),
  )
}
