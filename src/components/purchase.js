import { createElement } from 'react'
import { useCart } from '../context/CartContext'
import { items } from '../data/items'
import ItemCard from './ItemCard'

export default function Purchase() {
  const { cart, updateCart } = useCart()

  const handleQuantityChange = (itemId, qty) => {
    updateCart((prev) => ({ buyQuantity: { ...prev.buyQuantity, [itemId]: qty } }))
  }

  const totalItems = Object.values(cart.buyQuantity).reduce((acc, curr) => acc + curr, 0)
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * (cart.buyQuantity[item.id] ?? 0),
    0,
  )

  return createElement(
    'div',
    { className: 'purchase-page' },
    createElement('h1', null, 'Home'),
    createElement(
      'div',
      { className: 'purchase-items' },
      items.map((item) =>
        createElement(ItemCard, {
          key: item.id,
          item,
          quantity: cart.buyQuantity[item.id] ?? 0,
          onQuantityChange: handleQuantityChange,
        }),
      ),
    ),
    createElement('p', null, `Total items in cart: ${totalItems} ($${totalPrice.toFixed(2)})`),
  )
}
