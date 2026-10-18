import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CheckoutStepper from './CheckoutStepper'

const shippingFields = [
  ['name', 'Name', 'text'],
  ['addressLine1', 'Address Line 1', 'text'],
  ['addressLine2', 'Address Line 2 (Optional)', 'text'],
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

  const updateField = (field, value) => {
    setFields((current) => ({ ...current, [field]: value }))
    setError('')
  }

  return (
    <main className="site-main">
      <div className="site-container">
        <CheckoutStepper currentStep={3} />

        <div className="form-page-layout">
          <div className="form-card">
            <div className="form-header">
              <h1 className="form-title">Shipping Details</h1>
              <p className="form-description">Where should we deliver your order?</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="shipping-name" className="form-label">
                    Recipient Full Name
                  </label>
                  <input
                    id="shipping-name"
                    name="name"
                    type="text"
                    value={fields.name}
                    required
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Jane Doe"
                    className="form-input"
                  />
                </div>

                {/* Address Line 1 */}
                <div className="form-group">
                  <label htmlFor="shipping-addressLine1" className="form-label">
                    Address Line 1
                  </label>
                  <input
                    id="shipping-addressLine1"
                    name="addressLine1"
                    type="text"
                    value={fields.addressLine1}
                    required
                    onChange={(e) => updateField('addressLine1', e.target.value)}
                    placeholder="123 Creative Studio St."
                    className="form-input"
                  />
                </div>

                {/* Address Line 2 */}
                <div className="form-group">
                  <label htmlFor="shipping-addressLine2" className="form-label">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    id="shipping-addressLine2"
                    name="addressLine2"
                    type="text"
                    value={fields.addressLine2}
                    onChange={(e) => updateField('addressLine2', e.target.value)}
                    placeholder="Apt, Suite, Floor (Optional)"
                    className="form-input"
                  />
                </div>

                {/* City, State, ZIP */}
                <div className="form-row-2col">
                  <div className="form-group">
                    <label htmlFor="shipping-city" className="form-label">
                      City
                    </label>
                    <input
                      id="shipping-city"
                      name="city"
                      type="text"
                      value={fields.city}
                      required
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Porto"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shipping-state" className="form-label">
                      State / Province
                    </label>
                    <input
                      id="shipping-state"
                      name="state"
                      type="text"
                      value={fields.state}
                      required
                      onChange={(e) => updateField('state', e.target.value)}
                      placeholder="PRT / NY"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="shipping-zip" className="form-label">
                    ZIP Code (5 Digits)
                  </label>
                  <input
                    id="shipping-zip"
                    name="zip"
                    type="text"
                    value={fields.zip}
                    required
                    pattern="[0-9]{5}"
                    maxLength={5}
                    inputMode="numeric"
                    title="Enter exactly 5 digits"
                    onChange={(e) => updateField('zip', e.target.value)}
                    placeholder="10001"
                    className="form-input"
                  />
                </div>

                {error && (
                  <p className="form-alert-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', marginTop: 12, padding: '14px 20px', fontSize: 15 }}
                >
                  <span>Continue to Order</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

