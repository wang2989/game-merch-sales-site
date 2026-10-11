import { createElement, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { itemsById } from '../data/items'

export default function ShoppingCart() {
  const navigate = useNavigate()
  const { cart, updateCart, resetCart } = useCart()

  const handleQuantityChange = (itemId, value) => {
    const max = itemsById[itemId]?.stock ?? Infinity
    const qty = Math.min(max, Math.max(0, parseInt(value, 10) || 0))
    updateCart((prev) => ({ buyQuantity: { ...prev.buyQuantity, [itemId]: qty } }))
    if (qty > 0) {
      setErrorMessage('')
    }
  }

  // Items shown on this page are fixed at mount, so one reduced to 0 stays visible until the page is revisited
  const [visibleIds, setVisibleIds] = useState(() =>
    Object.keys(cart.buyQuantity).filter((id) => cart.buyQuantity[id] > 0),
  )
  const [errorMessage, setErrorMessage] = useState('')

  const handleDelete = (itemId) => {
    handleQuantityChange(itemId, 0)
    setVisibleIds((ids) => ids.filter((id) => id !== itemId))
  }

  const handleClear = () => {
    resetCart()
    setVisibleIds([])
    setErrorMessage('')
  }

  const handleCheckout = () => {
    if (totalItems === 0) {
      setErrorMessage('Cannot checkout with an empty cart')
      return
    }
    setErrorMessage('')
    navigate('/paymentEntry')
  }

  const totalItems = Object.values(cart.buyQuantity).reduce((acc, curr) => acc + curr, 0)

  return createElement(
    'div',
    null,
    createElement('h1', { style: { textAlign: 'center' } }, 'Shopping Cart'),
    createElement('p', { style: { textAlign: 'center' } }, `Total items: ${totalItems}`),
    createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 } },
      visibleIds.map((itemId) => {
        const qty = cart.buyQuantity[itemId] ?? 0
        const item = itemsById[itemId]
        const max = item?.stock ?? Infinity
        const size = { width: 96, height: 96, borderRadius: 4 }
        return createElement(
          'div',
          {
            key: itemId,
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              width: '100%',
              maxWidth: 480,
              padding: 12,
              border: '1px solid #ccc',
              borderRadius: 8,
            },
          },
          createElement(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: 12 } },
            item?.image
              ? createElement('img', {
                  src: item.image,
                  alt: item.name,
                  style: { ...size, objectFit: 'cover' },
                })
              : createElement('div', { style: { ...size, background: '#eee' } }),
            createElement('strong', null, item?.name ?? itemId),
          ),
          createElement(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: 4 } },
            createElement(
              'button',
              {
                type: 'button',
                'aria-label': `Decrease ${item?.name ?? itemId} quantity`,
                disabled: qty <= 0,
                onClick: () => handleQuantityChange(itemId, qty - 1),
              },
              '-',
            ),
            createElement('input', {
              id: `cart-item-${itemId}`,
              type: 'number',
              min: '0',
              max: item?.stock,
              value: qty,
              'aria-label': `${item?.name ?? itemId} quantity`,
              style: { width: 60, textAlign: 'center' },
              onChange: (e) => handleQuantityChange(itemId, e.target.value),
            }),
            createElement(
              'button',
              {
                type: 'button',
                'aria-label': `Increase ${item?.name ?? itemId} quantity`,
                disabled: qty >= max,
                onClick: () => handleQuantityChange(itemId, qty + 1),
              },
              '+',
            ),
            createElement(
              'button',
              {
                type: 'button',
                'aria-label': `Remove ${item?.name ?? itemId} from cart`,
                title: 'Remove',
                onClick: () => handleDelete(itemId),
                style: { marginLeft: 8, display: 'inline-flex', alignItems: 'center' },
              },
              createElement(
                'svg',
                {
                  width: 18,
                  height: 18,
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  strokeWidth: 2,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  'aria-hidden': 'true',
                },
                createElement('polyline', { points: '3 6 5 6 21 6' }),
                createElement('path', { d: 'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6' }),
                createElement('path', { d: 'M10 11v6M14 11v6' }),
                createElement('path', { d: 'M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' }),
              ),
            ),
          ),
        )
      }),
    ),
    errorMessage
      ? createElement(
          'p',
          {
            style: { color: 'red', textAlign: 'center', margin: '12px auto 0' },
            role: 'alert',
            'data-testid': 'empty-cart-error',
          },
          errorMessage,
        )
      : null,
    createElement(
      'button',
      {
        type: 'button',
        onClick: handleCheckout,
        style: { display: 'block', margin: '12px auto 0' },
      },
      'Checkout',
    ),
    createElement(
      'button',
      { type: 'button', onClick: handleClear, style: { display: 'block', margin: '12px auto 0' } },
      'Clear Cart',
    ),
  )
}
