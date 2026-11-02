import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          {/* Brand Manifesto */}
          <div className="footer-brand">
            <Link to="/" className="navbar-brand">
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
              <li><Link to="/purchase">Animal Crossing</Link></li>
              <li><Link to="/purchase">Stardew Valley</Link></li>
              <li><Link to="/purchase">Hollow Knight</Link></li>
              <li><Link to="/purchase">Teamfight Tactics</Link></li>
              <li><Link to="/purchase">Pokémon</Link></li>
              <li><Link to="/purchase">Slay the Spire</Link></li>
              <li><Link to="/purchase">Final Fantasy</Link></li>
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
