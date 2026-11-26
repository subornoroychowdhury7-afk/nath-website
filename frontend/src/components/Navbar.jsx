import React, { useState } from 'react';
import { Menu, X, Calculator } from 'lucide-react';

export default function Navbar({ shopStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <a href="#home" className="brand-logo" onClick={closeMenu}>
          <img
            src="/logo.jpg"
            alt="NATH CAFE ZONE Logo"
            style={{
              height: '46px',
              width: '46px',
              borderRadius: '10px',
              objectFit: 'cover',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          />
          <span>
            NATH <span className="accent-word">CAFE ZONE</span>
          </span>
        </a>

        <div className="status-pill" aria-live="polite">
          <span className={`status-dot ${shopStatus?.isOpen === false ? 'closed' : ''}`} />
          <span>{shopStatus?.label || 'Open Daily • 10 AM – 9 PM'}</span>
        </div>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <a href="#services" onClick={closeMenu}>
              Services
            </a>
          </li>
          <li>
            <a href="#estimator" onClick={closeMenu}>
              Price Estimator
            </a>
          </li>
          <li>
            <a href="#about" onClick={closeMenu}>
              About
            </a>
          </li>
          <li>
            <a href="#gallery" onClick={closeMenu}>
              Gallery
            </a>
          </li>
          <li>
            <a href="#contact" onClick={closeMenu}>
              Contact
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          <a href="#estimator" className="btn btn-accent btn-sm">
            <Calculator size={16} />
            Instant Quote
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
