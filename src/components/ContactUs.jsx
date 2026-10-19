import { useState } from 'react'

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    issueType: 'Return / Exchange Request',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="site-main">
      <div className="site-container">
        <div style={{ maxWidth: 900, margin: '32px auto 64px' }}>
          
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="item-badge-pill teal" style={{ position: 'static', display: 'inline-block', marginBottom: 12 }}>
              ✦ Care & Client Support
            </span>
            <h1 className="form-title" style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', marginBottom: 12 }}>
              Contact Us & After-Sale Support
            </h1>
            <p className="form-description" style={{ maxWidth: 560, margin: '0 auto', fontSize: 15 }}>
              Need assistance with sizing, delivery tracking, or initiating a return? Our client care team is ready to assist.
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 40 }}>
            <div className="item-card" style={{ padding: 24 }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-secondary)', fontWeight: 700 }}>
                Returns & Exchanges
              </span>
              <h3 style={{ fontSize: 17, margin: '8px 0 4px', color: 'var(--color-ink)' }}>Orders Desk</h3>
              <p style={{ fontSize: 13, color: 'var(--color-ink-secondary)', marginBottom: 16 }}>
                Queries regarding delivered items and return labels.
              </p>
              <a href="mailto:support@relicplaza.com" style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>
                support@relicplaza.com &rarr;
              </a>
            </div>

            <div className="item-card" style={{ padding: 24 }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-secondary)', fontWeight: 700 }}>
                Direct Hotline
              </span>
              <h3 style={{ fontSize: 17, margin: '8px 0 4px', color: 'var(--color-ink)' }}>Customer Care</h3>
              <p style={{ fontSize: 13, color: 'var(--color-ink-secondary)', marginBottom: 16 }}>
                Monday to Friday, 9:00 AM – 6:00 PM EST.
              </p>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>
                1-800-555-RELIC
              </span>
            </div>

            <div className="item-card" style={{ padding: 24 }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-ink-secondary)', fontWeight: 700 }}>
                Studio & Logistics
              </span>
              <h3 style={{ fontSize: 17, margin: '8px 0 4px', color: 'var(--color-ink)' }}>Fulfillment Hub</h3>
              <p style={{ fontSize: 13, color: 'var(--color-ink-secondary)', marginBottom: 16 }}>
                Relic Plaza Distribution Center
              </p>
              <span style={{ fontSize: 14, color: 'var(--color-ink-secondary)' }}>
                Columbus, OH 43210
              </span>
            </div>
          </div>

          {/* Policy & FAQ Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 40 }}>
            <div className="form-card" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 14, color: 'var(--color-ink)' }}>
                Return & Exchange Policy
              </h2>
              <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: 'var(--color-ink-secondary)' }}>
                <li style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 10 }}>
                  <strong style={{ color: 'var(--color-ink)' }}>30-Day Window:</strong> Items in original condition may be returned or exchanged within 30 days of receipt.
                </li>
                <li style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 10 }}>
                  <strong style={{ color: 'var(--color-ink)' }}>Apparel Condition:</strong> Hoodies, sweaters, and shirts must remain unwashed and unworn with tags attached.
                </li>
                <li>
                  <strong style={{ color: 'var(--color-ink)' }}>Prompt Refunds:</strong> Approved returns are credited back to the original payment method within 3–5 business days.
                </li>
              </ul>
            </div>

            <div className="form-card" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 14, color: 'var(--color-ink)' }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 4 }}>
                    Where do I find my order confirmation reference?
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--color-ink-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Your reference code (e.g. <code>ORD-2026-X8892</code>) appears on the final checkout screen and in your email summary.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 4 }}>
                    What are standard shipping timelines?
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--color-ink-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Orders are packaged within 24 business hours and delivered via expedited ground within 3–5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Support Request Form */}
          <div className="form-card" style={{ padding: 36 }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-ink)', marginBottom: 6 }}>
                Submit a Support Request
              </h2>
              <p style={{ fontSize: 14, color: 'var(--color-ink-secondary)', margin: 0 }}>
                Submit your inquiry and our support team will respond within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', background: 'var(--color-card-muted)', borderRadius: 'var(--radius-lg)' }}>
                <div className="confirmation-icon-circle" style={{ width: 48, height: 48, fontSize: 22, margin: '0 auto 16px' }}>
                  ✓
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 8 }}>Inquiry Received</h3>
                <p style={{ fontSize: 14, color: 'var(--color-ink-secondary)', margin: '0 auto', maxWidth: 440 }}>
                  Thank you, <strong>{formData.name || 'valued customer'}</strong>. A support agent has logged your ticket and will follow up shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary"
                  style={{ marginTop: 20 }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-row-2col">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Your Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="e.g. Jane Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="e.g. name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row-2col">
                    <div className="form-group">
                      <label className="form-label" htmlFor="orderNumber">Order Confirmation # (optional)</label>
                      <input
                        id="orderNumber"
                        name="orderNumber"
                        type="text"
                        placeholder="ORD-2026-X8892"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="issueType">Inquiry Type</label>
                      <select
                        id="issueType"
                        name="issueType"
                        value={formData.issueType}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option>Return / Exchange Request</option>
                        <option>Missing / Damaged Merch</option>
                        <option>Order Status & Tracking</option>
                        <option>General Support</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      required
                      placeholder="Please describe how we can assist you..."
                      value={formData.message}
                      onChange={handleChange}
                      className="form-input"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ padding: '14px 28px', fontSize: 14 }}
                    >
                      Send Message &rarr;
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}