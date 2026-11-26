import React, { useMemo, useState } from 'react';
import {
  Printer,
  Trophy,
  Signpost,
  Palette,
  Award,
  Smartphone,
  ArrowUpRight,
  Check,
  X,
} from 'lucide-react';

const ICON_MAP = {
  printing: Printer,
  'trophy-medal': Trophy,
  'flex-printing': Signpost,
  'vinyl-printing': Palette,
  'button-badges': Award,
  'mobile-digital': Smartphone,
};

const CATEGORIES = ['All', 'Printing', 'Signage & Flex', 'Awards & Badges', 'Digital & Recharge'];

export default function ServicesSection({ services, onRequestQuote }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedService, setSelectedService] = useState(null);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return services;
    return services.filter((s) => s.category === activeCategory);
  }, [services, activeCategory]);

  return (
    <section className="section section-white" id="services">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="eyebrow-label">WHAT WE DO</span>
            <h2 className="section-title">Precision Services Under One Roof</h2>
            <p className="section-desc">
              Transparent pricing, crisp output, and dependable turnaround in Kanchrapara.
            </p>
          </div>

          <div className="filter-pills" role="tablist" aria-label="Service categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="services-grid">
          {filtered.map((service) => {
            const IconComponent = ICON_MAP[service.id] || Printer;
            return (
              <article key={service.id} className="service-card">
                <div className="service-media">
                  <img src={service.image} alt={service.title} loading="lazy" />
                  <span className="service-tag">{service.category}</span>
                </div>

                <div className="service-body">
                  <div className="service-top-row">
                    <div className="service-icon-box">
                      <IconComponent size={20} />
                    </div>
                    <span className="service-price">{service.startingPrice}</span>
                  </div>

                  <h3>{service.title}</h3>
                  <p>{service.shortDesc}</p>

                  <div className="service-footer">
                    <span className="service-turnaround">Turnaround: {service.turnaround}</span>
                    <button
                      type="button"
                      className="service-link-btn"
                      onClick={() => setSelectedService(service)}
                    >
                      View Specs <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selectedService && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedService(null)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow-label" style={{ marginBottom: 2 }}>
                  {selectedService.category}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem' }}>
                  {selectedService.title}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close"
                aria-label="Close specifications"
                onClick={() => setSelectedService(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ color: 'var(--ink-secondary)', marginBottom: 18 }}>
                {selectedService.shortDesc}
              </p>

              <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
                {selectedService.specs.map((spec) => (
                  <div
                    key={spec}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--base-light)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    <Check size={16} color="#ff4d00" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ fontSize: '0.88rem', color: 'var(--ink-secondary)' }}>
                  Starting at <strong style={{ color: 'var(--ink-primary)' }}>{selectedService.startingPrice}</strong> •{' '}
                  {selectedService.turnaround}
                </div>
                <button
                  type="button"
                  className="btn btn-accent btn-sm"
                  onClick={() => {
                    const chosen = selectedService;
                    setSelectedService(null);
                    onRequestQuote(chosen);
                  }}
                >
                  Book / Quote This Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
