import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          {/* Brand Manifesto */}
          <div className="footer-brand">
            <Link to="/purchase" className="navbar-brand">
              <span>relic plaza</span>
              <span className="brand-mark">®</span>
            </Link>
            <p className="footer-tagline">
              Curated everyday tools, apparel, and collectibles. Ethically made for players, streamers, and fans.
            </p>
          </div>

          {/* Collection Column */}
          <div>
            <h3 className="footer-col-title">Collection</h3>
            <ul className="footer-links-list">
              <li><Link to="/purchase">Hoodies & Sweaters</Link></li>
              <li><Link to="/purchase">Graphic Tees</Link></li>
              <li><Link to="/purchase">Caps & Headwear</Link></li>
              <li><Link to="/purchase">Desk Accessories</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© 2026 Relic Plaza · Built with craftsmanship.</p>
        </div>
      </div>
    </footer>
  )
}
