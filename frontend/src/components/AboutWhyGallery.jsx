import React, { useState } from 'react';
import { CheckCircle2, Zap, BadgeIndianRupee, Sparkles, ShieldCheck, X } from 'lucide-react';

const WHY_ITEMS = [
  {
    icon: Zap,
    title: 'Fast Turnaround',
    desc: 'Same-day document printing, urgent flex banners, and quick online form processing.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Transparent Rates',
    desc: 'Honest local pricing with automatic bulk slab discounts for schools and events.',
  },
  {
    icon: Sparkles,
    title: 'Custom Craftsmanship',
    desc: 'Tailored trophies, medals, badges, and vinyl decals designed to your exact branding.',
  },
  {
    icon: ShieldCheck,
    title: 'Kanchrapara Trusted',
    desc: 'Reliable neighborhood cyber cafe & studio serving students, clubs, and local shops.',
  },
];

export default function AboutWhyGallery({ gallery }) {
  const [lightboxItem, setLightboxItem] = useState(null);

  return (
    <>
      <section className="section section-white" id="about">
        <div className="container about-grid">
          <div className="about-photo-frame">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85"
              alt="NATH CAFE ZONE workspace in Kanchrapara"
              loading="lazy"
            />
            <div className="about-badge-float">
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Subhas More, Kanchrapara</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted-on-dark)' }}>
                  North 24 Parganas, WB • PIN 743145
                </div>
              </div>
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
              >
                10 AM – 9 PM
              </span>
            </div>
          </div>

          <div>
            <span className="eyebrow-label">ABOUT NATH CAFE ZONE</span>
            <h2 className="section-title">Your Local Digital &amp; Customization Partner</h2>
            <p className="section-desc">
              Located at Subhas More, Kanchrapara, <strong>NATH CAFE ZONE</strong> combines an
              everyday cyber cafe with a full-service printing and custom awards workshop.
            </p>
            <p className="section-desc">
              Whether you need urgent exam printouts, a 10-foot shop flex banner, engraved sports
              trophies, or 200 event button badges — everything is produced cleanly under one roof.
            </p>

            <div className="checklist-grid">
              {[
                'Sharp Laser Output',
                'Bulk Event Pricing',
                'Same-Day Delivery',
                'Custom Artwork Support',
              ].map((item) => (
                <div key={item} className="checklist-item">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-header-center">
            <span className="eyebrow-label">WHY CHOOSE US</span>
            <h2 className="section-title">Built for Speed, Clarity &amp; Local Trust</h2>
            <p className="section-desc">
              We strip away delays and guesswork so your printing and digital work gets done right
              the first time.
            </p>
          </div>

          <div className="why-grid">
            {WHY_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="why-card">
                  <div className="why-icon">
                    <Icon size={22} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-white" id="gallery">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow-label">OUR WORK</span>
              <h2 className="section-title">Studio &amp; Output Gallery</h2>
              <p className="section-desc">Click any showcase card to inspect closer.</p>
            </div>
          </div>

          <div className="gallery-grid">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="gallery-card"
                role="button"
                tabIndex={0}
                onClick={() => setLightboxItem(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setLightboxItem(item);
                }}
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="gallery-caption">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxItem && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxItem(null)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow-label" style={{ marginBottom: 2 }}>
                  {lightboxItem.category}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
                  {lightboxItem.title}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close"
                aria-label="Close preview"
                onClick={() => setLightboxItem(null)}
              >
                <X size={18} />
              </button>
            </div>
            <img
              src={lightboxItem.image}
              alt={lightboxItem.title}
              style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
