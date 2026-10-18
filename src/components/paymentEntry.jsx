import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CheckoutStepper from './CheckoutStepper'

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

  // Format card number for live preview
  const formatCardPreview = (num) => {
    if (!num) return '•••• •••• •••• ••••'
    const clean = num.replace(/\s+/g, '')
    const parts = clean.match(/.{1,4}/g) || []
    return parts.join(' ')
  }

  return (
    <main className="site-main">
      <div className="site-container">
        <CheckoutStepper currentStep={2} />

        <div className="form-page-layout">
          <div className="form-card">
            <div className="form-header">
              <h1 className="form-title">Payment Entry</h1>
              <p className="form-description">Please enter your credit card information.</p>
            </div>

            {/* Interactive Card Visual Preview */}
            <div className="interactive-card-preview" aria-hidden="true">
              <div className="card-preview-chip" />
              <div className="card-preview-number">
                {formatCardPreview(formData.credit_card_number)}
              </div>
              <div className="card-preview-bottom">
                <div>
                  <div className="card-preview-label">Cardholder</div>
                  <div className="card-preview-value">
                    {formData.card_holder_name ? formData.card_holder_name.toUpperCase() : 'YOUR NAME'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="card-preview-label">Expires</div>
                  <div className="card-preview-value">
                    {formData.expir_date || 'MM/YY'}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                {/* Cardholder Name */}
                <div className="form-group">
                  <label htmlFor="card_holder_name" className="form-label">
                    Card Holder Name
                  </label>
                  <input
                    id="card_holder_name"
                    name="card_holder_name"
                    type="text"
                    value={formData.card_holder_name}
                    onChange={handleChange}
                    placeholder="Enter card holder name"
                    aria-label="Card Holder Name"
                    className={`form-input ${errors.card_holder_name ? 'has-error' : ''}`}
                  />
                  {errors.card_holder_name && (
                    <span
                      id="card_holder_name-error"
                      data-testid="card_holder_name-error"
                      className="field-error-text"
                      role="alert"
                    >
                      {errors.card_holder_name}
                    </span>
                  )}
                </div>

                {/* Credit Card Number */}
                <div className="form-group">
                  <label htmlFor="credit_card_number" className="form-label">
                    Credit Card Number
                  </label>
                  <input
                    id="credit_card_number"
                    name="credit_card_number"
                    type="text"
                    value={formData.credit_card_number}
                    onChange={handleChange}
                    placeholder="Enter credit card number"
                    aria-label="Credit Card Number"
                    className={`form-input ${errors.credit_card_number ? 'has-error' : ''}`}
                  />
                  {errors.credit_card_number && (
                    <span
                      id="credit_card_number-error"
                      data-testid="credit_card_number-error"
                      className="field-error-text"
                      role="alert"
                    >
                      {errors.credit_card_number}
                    </span>
                  )}
                </div>

                {/* Expiration Date & CVV (2 Column Layout) */}
                <div className="form-row-2col">
                  <div className="form-group">
                    <label htmlFor="expir_date" className="form-label">
                      Expiration Date
                    </label>
                    <input
                      id="expir_date"
                      name="expir_date"
                      type="text"
                      value={formData.expir_date}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      aria-label="Expiration Date"
                      className={`form-input ${errors.expir_date ? 'has-error' : ''}`}
                    />
                    {errors.expir_date && (
                      <span
                        id="expir_date-error"
                        data-testid="expir_date-error"
                        className="field-error-text"
                        role="alert"
                      >
                        {errors.expir_date}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvvCode" className="form-label">
                      CVV Code
                    </label>
                    <input
                      id="cvvCode"
                      name="cvvCode"
                      type="text"
                      value={formData.cvvCode}
                      onChange={handleChange}
                      placeholder="Enter CVV code"
                      aria-label="CVV Code"
                      className={`form-input ${errors.cvvCode ? 'has-error' : ''}`}
                    />
                    {errors.cvvCode && (
                      <span
                        id="cvvCode-error"
                        data-testid="cvvCode-error"
                        className="field-error-text"
                        role="alert"
                      >
                        {errors.cvvCode}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  id="save-credit-card-button"
                  onClick={handleSubmit}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: 12, padding: '14px 20px', fontSize: 15 }}
                >
                  Save Credit Card Information
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

