import { createElement, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function PaymentEntry() {
  const navigate = useNavigate()
  const { cart, updateCart } = useCart()

  const [formData, setFormData] = useState({
    credit_card_number: cart.credit_card_number || '',
    expir_date: cart.expir_date || '',
    cvvCode: cart.cvvCode || '',
    card_holder_name: cart.card_holder_name || '',
  })

  const [errors, setErrors] = useState({})

  const validateField = (name, value) => {
    const trimmed = typeof value === 'string' ? value.trim() : ''
    switch (name) {
      case 'credit_card_number':
        if (!trimmed) {
          return 'Please enter your credit card number.'
        }
        if (!/^\d{15,19}$/.test(trimmed)) {
          return 'Credit Card Number must be a valid 15-19 digit number.'
        }
        return ''
      case 'expir_date': {
        const digits = typeof value === 'string' ? value.replace(/\D/g, '') : ''
        if (!digits) {
          return 'Please enter your expiration date.'
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(trimmed)) {
          return 'Expiration date must follow the format MM/YY.'
        }
        return ''
      }
      case 'cvvCode':
        if (!trimmed) {
          return 'Please enter your CVV code.'
        }
        if (!/^\d{3}$/.test(trimmed)) {
          return 'CVV Code should only take 3 integers.'
        }
        return ''
      case 'card_holder_name':
        if (!trimmed) {
          return 'Please enter your card holder name.'
        }
        return ''
      default:
        return ''
    }
  }

  const isAllowedInput = (name, value) => {
    switch (name) {
      case 'credit_card_number':
        return /^\d{0,19}$/.test(value)
      case 'cvvCode':
        return /^\d{0,3}$/.test(value)
      default:
        return true
    }
  }

  const handleExpirationDateChange = (value) => {
    // Only allow digits and /
    if (/[^\d/]/.test(value)) {
      return
    }

    let digits = value.replace(/\D/g, '')
    // Handle backspacing over the slash
    if (
      formData.expir_date.endsWith('/') &&
      !value.includes('/') &&
      value.length < formData.expir_date.length
    ) {
      digits = digits.slice(0, -1)
    }

    // Only allow a set of 4 integers (2 for MM, 2 for YY)
    if (digits.length > 4) {
      return
    }

    let formatted = ''
    if (digits.length === 0) {
      formatted = ''
    } else if (digits.length <= 2) {
      formatted = `${digits}/`
    } else {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`
    }

    setFormData((prev) => ({ ...prev, expir_date: formatted }))
    if (errors.expir_date) {
      setErrors((prev) => ({ ...prev, expir_date: '' }))
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'expir_date') {
      handleExpirationDateChange(value)
      return
    }
    if (!isAllowedInput(name, value)) {
      return
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    const newErrors = {
      credit_card_number: validateField('credit_card_number', formData.credit_card_number),
      expir_date: validateField('expir_date', formData.expir_date),
      cvvCode: validateField('cvvCode', formData.cvvCode),
      card_holder_name: validateField('card_holder_name', formData.card_holder_name),
    }

    const hasErrors = Object.values(newErrors).some((err) => Boolean(err))

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    updateCart({
      credit_card_number: formData.credit_card_number.trim(),
      expir_date: formData.expir_date.trim(),
      cvvCode: formData.cvvCode.trim(),
      card_holder_name: formData.card_holder_name.trim(),
    })
    navigate('/shippingEntry')
  }

  const fields = [
    {
      id: 'credit_card_number',
      name: 'credit_card_number',
      label: 'Credit Card Number',
      placeholder: 'Enter credit card number',
    },
    {
      id: 'expir_date',
      name: 'expir_date',
      label: 'Expiration Date',
      placeholder: 'MM/YY',
    },
    {
      id: 'cvvCode',
      name: 'cvvCode',
      label: 'CVV Code',
      placeholder: 'Enter CVV code',
    },
    {
      id: 'card_holder_name',
      name: 'card_holder_name',
      label: 'Card Holder Name',
      placeholder: 'Enter card holder name',
    },
  ]

  return createElement(
    'div',
    { style: { maxWidth: 640, margin: '0 auto', padding: '24px 16px' } },
    createElement('h1', { style: { textAlign: 'center' } }, 'Payment Entry'),
    createElement(
      'p',
      { style: { textAlign: 'center', marginBottom: 24, color: '#555' } },
      'Please enter your credit card information.',
    ),
    createElement(
      'form',
      { onSubmit: handleSubmit },
      createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
        fields.map(({ id, name, label, placeholder }) =>
          createElement(
            'div',
            {
              key: name,
              style: {
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
              },
            },
            createElement(
              'label',
              {
                htmlFor: id,
                style: { minWidth: 160, fontWeight: 'bold' },
              },
              label,
            ),
            createElement('input', {
              id,
              name,
              type: 'text',
              value: formData[name],
              onChange: handleChange,
              placeholder,
              'aria-label': label,
              style: {
                padding: '8px 12px',
                border: errors[name] ? '1px solid red' : '1px solid #ccc',
                borderRadius: 4,
                fontSize: '14px',
                width: 220,
              },
            }),
            errors[name]
              ? createElement(
                  'span',
                  {
                    id: `${name}-error`,
                    'data-testid': `${name}-error`,
                    style: { color: 'red', fontSize: '14px' },
                    role: 'alert',
                  },
                  errors[name],
                )
              : null,
          ),
        ),
      ),
      createElement(
        'button',
        {
          type: 'submit',
          id: 'save-credit-card-button',
          onClick: handleSubmit,
          style: {
            display: 'block',
            margin: '32px auto 0',
            padding: '10px 24px',
            fontSize: '16px',
            cursor: 'pointer',
          },
        },
        'Save Credit Card Information',
      ),
    ),
  )
}
