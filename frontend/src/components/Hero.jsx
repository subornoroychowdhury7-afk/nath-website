import React from 'react';
import { ArrowRight, Calculator, MapPin } from 'lucide-react';

const QUICK_JUMPS = [
  { label: 'B&W / Colour Print', tab: 'printing' },
  { label: 'Flex & Vinyl Signage', tab: 'flex-vinyl' },
  { label: 'Trophies & Medals', tab: 'trophy-medal' },
  { label: 'Button Badges', tab: 'button-badges' },
];

export default function Hero({ onSelectEstimatorTab }) {
  const handleQuickJump = (tab) => {
    onSelectEstimatorTab(tab);
    const el = document.getElementById('estimator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section" id="home">
      {/* Banner background with multi-layer fade */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          opacity: 0.13,
          filter: 'blur(2px) saturate(1.4)',
          transform: 'scale(1.04)',
          zIndex: 0,
          animation: 'bannerPulse 12s ease-in-out infinite',
        }}
      />
      {/* Radial vignette to fade edges smoothly */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 85% 70% at 50% 40%, transparent 25%, rgba(11,14,20,0.72) 65%, rgba(11,14,20,0.97) 100%)',
          zIndex: 1,
        }}
      />
      <div className="hero-grid-bg" style={{ zIndex: 2 }} />
      <div className="container hero-layout" style={{ position: 'relative', zIndex: 3 }}>
        <div>
          <div className="hero-eyebrow">
            <span className="dot" />
            <span>Subhas More, Kanchrapara • Cyber Cafe &amp; Print Studio</span>
          </div>

          <h1 className="hero-title">
            Your One Stop <span className="accent-text">Digital &amp; Printing</span> Solution
          </h1>

          <p className="hero-subtitle">
            Welcome to <strong>NATH CAFE ZONE</strong> — Kanchrapara&apos;s trusted centre for
            precision document printing, flex &amp; vinyl signage, custom engraved trophies &amp;
            medals, button badges, online forms, and instant mobile recharge.
          </p>

          <div className="hero-cta-row">
            <a href="#estimator" className="btn btn-accent">
              <Calculator size={18} />
              Calculate Instant Price
            </a>
            <a href="#services" className="btn btn-outline-dark">
              Explore Services
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="hero-metrics">
            <div>
              <div className="metric-value">Same-Day</div>
              <div className="metric-label">Print &amp; Flex Turnaround</div>
            </div>
            <div>
              <div className="metric-value">6+ Core</div>
              <div className="metric-label">Digital &amp; Custom Units</div>
            </div>
            <div>
              <div className="metric-value">7 Days</div>
              <div className="metric-label">10:00 AM – 9:00 PM</div>
            </div>
          </div>
        </div>

        <div className="hero-visual-card">
          <img
            className="hero-visual-img"
            src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=85"
            alt="NATH CAFE ZONE printing and digital workstation"
          />
          <div className="hero-visual-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Quick Price Estimator</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: '0.78rem',
                  color: '#a2aab8',
                }}
              >
                <MapPin size={13} color="#ff4d00" />
                PIN 743145
              </span>
            </div>

            <div className="hero-quick-list">
              {QUICK_JUMPS.map((item) => (
                <button
                  key={item.tab}
                  type="button"
                  className="hero-quick-chip"
                  onClick={() => handleQuickJump(item.tab)}
                >
                  <span>{item.label}</span>
                  <span className="chip-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
