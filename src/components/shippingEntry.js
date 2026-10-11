import { createElement, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const shippingFields = [
  ['name', 'Name', 'text'],
  ['addressLine1', 'Address Line 1', 'text'],
  ['addressLine2', 'Address Line 2', 'text'],
  ['city', 'City', 'text'],
  ['state', 'State', 'text'],
  ['zip', 'ZIP Code', 'text'],
]

export default function ShippingEntry() {
  const { cart, updateCart } = useCart()
  const navigate = useNavigate()
  const [fields, setFields] = useState(() => ({
    name: cart.name,
    addressLine1: cart.address_1,
    addressLine2: cart.address_2,
    city: cart.city,
    state: cart.state,
    zip: cart.zip,
  }))
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (shippingFields.some(([field]) => field !== 'addressLine2' && !fields[field].trim())) {
      setError('Please fill in every shipping field.')
      return
    }

    const zip = fields.zip.trim()
    if (!/^\d{5}$/.test(zip)) {
      setError('ZIP Code must be exactly 5 digits.')
      return
    }

    updateCart({
      name: fields.name.trim(),
      address_1: fields.addressLine1.trim(),
      address_2: fields.addressLine2.trim(),
      city: fields.city.trim(),
      state: fields.state.trim(),
      zip,
    })
    navigate('/viewOrder')
  }

  return createElement(
    'main',
    { style: { maxWidth: 480, margin: '0 auto', padding: 24, width: '100%', boxSizing: 'border-box' } },
    createElement('h1', null, 'Shipping Details'),
    createElement(
      'form',
      { onSubmit: handleSubmit, style: { display: 'grid', gap: 16, textAlign: 'left' } },
      shippingFields.map(([field, label, type]) =>
        createElement(
          'label',
          { key: field, htmlFor: `shipping-${field}`, style: { display: 'grid', gap: 4 } },
          label,
          createElement('input', {
            id: `shipping-${field}`,
            name: field,
            type,
            value: fields[field],
            required: field !== 'addressLine2',
            ...(field === 'zip'
              ? { pattern: '[0-9]{5}', maxLength: 5, inputMode: 'numeric', title: 'Enter exactly 5 digits' }
              : {}),
            onChange: (event) => {
              setFields((current) => ({ ...current, [field]: event.target.value }))
              setError('')
            },
            style: { padding: 8, font: 'inherit' },
          }),
        ),
      ),
      error ? createElement('p', { role: 'alert', style: { color: '#b00020' } }, error) : null,
      createElement('button', { type: 'submit' }, 'Continue to Order'),
    ),
  )
}
