import { Link } from 'react-router-dom'

export default function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for subscribing! Your 15% discount code is MERCH15.')
  }

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          {/* Brand Manifesto */}
          <div className="footer-brand">
            <Link to="/purchase" className="navbar-brand">
              <span>gamemerch</span>
              <span className="brand-mark">®</span>
            </Link>
            <p className="footer-tagline">
              Curated everyday tools, apparel, and collectibles. Ethically made for players, streamers, and fans.
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="footer-col-title">Collection</h3>
            <ul className="footer-links-list">
              <li><Link to="/purchase">Hoodies & Sweaters</Link></li>
              <li><Link to="/purchase">Graphic Tees</Link></li>
              <li><Link to="/purchase">Caps & Headwear</Link></li>
              <li><Link to="/purchase">Desk Accessories</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="footer-col-title">Customer Care</h3>
            <ul className="footer-links-list">
              <li><a href="#shipping" onClick={(e) => e.preventDefault()}>Shipping & Returns</a></li>
              <li><a href="#sizing" onClick={(e) => e.preventDefault()}>Size Guide</a></li>
              <li><a href="#ethics" onClick={(e) => e.preventDefault()}>Ethical Sourcing</a></li>
              <li><a href="#faq" onClick={(e) => e.preventDefault()}>Help & FAQs</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="footer-col-title">Stay Connected</h3>
            <p style={{ fontSize: 13, color: 'var(--color-ink-secondary)', lineHeight: 1.4, marginBottom: 8 }}>
              Subscribe and receive 15% off your first order plus secret drop alerts.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                required
                aria-label="Newsletter email address"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© 2026 gamemerch® · Built with craftsmanship.</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <span>·</span>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <span>·</span>
            <a href="#cookies" onClick={(e) => e.preventDefault()}>Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

