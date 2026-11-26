import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Copy,
  Check,
  Send,
  Search,
  ExternalLink,
  X,
} from 'lucide-react';
import { apiUrl } from '../config/api.js';

export default function ContactHub({ shopInfo, prefillQuote, onClearPrefill }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    service: 'Printing',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [copiedAddr, setCopiedAddr] = useState(false);

  const [lookupId, setLookupId] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    if (prefillQuote) {
      setForm((prev) => ({
        ...prev,
        service: prefillQuote.service || prev.service,
        message: prefillQuote.quoteSummary
          ? `Quote Locked: ${prefillQuote.quoteSummary} (Approx ₹${prefillQuote.estimatedTotal}). Please confirm availability.`
          : prev.message,
      }));
    }
  }, [prefillQuote]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(
        'NATH CAFE ZONE, Subhas More, Kanchrapara, North 24 Parganas, West Bengal - 743145'
      );
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(apiUrl('/api/enquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          quoteSummary: prefillQuote?.quoteSummary || '',
          estimatedTotal: prefillQuote?.estimatedTotal ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not submit enquiry. Please check your details.');
      } else {
        setReceipt({
          enquiry: data.enquiry,
          whatsappUrl: data.whatsappUrl,
        });
        setForm({ name: '', phone: '', service: 'Printing', message: '' });
        if (onClearPrefill) onClearPrefill();
      }
    } catch {
      const fallbackText = `Hello NATH CAFE ZONE,\n\nName: ${form.name}\nMobile: ${form.phone}\nService: ${form.service}\n\nRequirement:\n${form.message}`;
      const fallbackUrl = `https://wa.me/${shopInfo.whatsappNumber}?text=${encodeURIComponent(
        fallbackText
      )}`;
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    setLookupError('');
    setLookupResult(null);
    if (!lookupId.trim()) return;

    try {
      const res = await fetch(apiUrl(`/api/enquiries/${encodeURIComponent(lookupId.trim())}`));
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setLookupError(data.error || 'Reference ID not found.');
      } else {
        setLookupResult(data.enquiry);
      }
    } catch {
      setLookupError('Unable to reach order lookup service.');
    }
  };

  return (
    <section className="section section-light" id="contact">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="eyebrow-label">VISIT OR BOOK ONLINE</span>
            <h2 className="section-title">Visit NATH CAFE ZONE</h2>
            <p className="section-desc">
              Submit your requirement online to generate a Reference ID, or message us directly on
              WhatsApp.
            </p>
          </div>
        </div>

        <div className="contact-grid">
          <div className="contact-info-panel">
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.65rem' }}>
                Let&apos;s Connect
              </h3>

              <div className="contact-row">
                <div className="contact-icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <strong>Address</strong>
                  <p>
                    {shopInfo.address.line1}
                    <br />
                    {shopInfo.address.line2}
                    <br />
                    {shopInfo.address.line3}
                    <br />
                    PIN - {shopInfo.address.pin}
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    style={{ marginTop: 10 }}
                    onClick={handleCopyAddress}
                  >
                    {copiedAddr ? <Check size={14} /> : <Copy size={14} />}
                    {copiedAddr ? 'Address Copied' : 'Copy Address'}
                  </button>
                </div>
              </div>

              <div className="contact-row">
                <div className="contact-icon">
                  <Phone size={20} />
                </div>
                <div>
                  <strong>Phone &amp; WhatsApp</strong>
                  <p>{shopInfo.phoneDisplay}</p>
                </div>
              </div>

              <div className="contact-row">
                <div className="contact-icon">
                  <Clock size={20} />
                </div>
                <div>
                  <strong>Business Hours</strong>
                  <p>
                    {shopInfo.hours.days}
                    <br />
                    {shopInfo.hours.display}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 32,
                paddingTop: 22,
                borderTop: '1px solid var(--border-dark)',
              }}
            >
              <strong style={{ fontSize: '0.88rem', display: 'block', marginBottom: 10 }}>
                Track Existing Enquiry
              </strong>
              <form onSubmit={handleLookup} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  className="field-input"
                  placeholder="Enter Ref ID (e.g. NCZ-2026-1234)"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  style={{
                    background: 'var(--base-dark-card)',
                    color: '#fff',
                    borderColor: 'var(--border-dark)',
                  }}
                />
                <button type="submit" className="btn btn-accent btn-sm" aria-label="Track enquiry">
                  <Search size={16} />
                </button>
              </form>
              {lookupError && (
                <p style={{ color: 'var(--accent)', fontSize: '0.82rem', marginTop: 8 }}>
                  {lookupError}
                </p>
              )}
              {lookupResult && (
                <div
                  style={{
                    marginTop: 10,
                    padding: 12,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--base-dark-card)',
                    border: '1px solid var(--accent-border)',
                    fontSize: '0.84rem',
                  }}
                >
                  <div>
                    <strong>{lookupResult.refId}</strong> • {lookupResult.status}
                  </div>
                  <div style={{ color: 'var(--ink-muted-on-dark)' }}>
                    {lookupResult.name} — {lookupResult.service}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="contact-form-panel">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 6 }}>
              Send an Enquiry or Order
            </h3>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
              Instant reference number + WhatsApp confirmation.
            </p>

            {prefillQuote?.quoteSummary && (
              <div className="alert-banner">
                <strong>Attached Estimate:</strong> {prefillQuote.quoteSummary} (Approx ₹
                {prefillQuote.estimatedTotal})
              </div>
            )}

            {error && (
              <div className="alert-banner" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="field-group">
                  <label className="field-label" htmlFor="enq-name">
                    Your Name
                  </label>
                  <input
                    id="enq-name"
                    type="text"
                    className="field-input"
                    placeholder="e.g. Subhajit Das"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="enq-phone">
                    Mobile Number
                  </label>
                  <input
                    id="enq-phone"
                    type="tel"
                    className="field-input"
                    placeholder="+91 98XXXXXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="enq-service">
                  Service Category
                </label>
                <select
                  id="enq-service"
                  className="field-select"
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                >
                  <option value="Printing">All Types of Printing</option>
                  <option value="Trophy & Medal">Trophy &amp; Medal</option>
                  <option value="Flex Printing">Flex Printing</option>
                  <option value="Vinyl Printing">Vinyl Printing</option>
                  <option value="Button Badge">Button Badges</option>
                  <option value="Mobile Recharge">Cyber Cafe &amp; Mobile Recharge</option>
                  <option value="Other">Other Custom Request</option>
                </select>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="enq-message">
                  Requirement Details
                </label>
                <textarea
                  id="enq-message"
                  rows="4"
                  className="field-textarea"
                  placeholder="Size, quantity, paper GSM, event date, or custom text..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-accent"
                style={{ width: '100%' }}
                disabled={submitting}
              >
                <Send size={17} />
                {submitting ? 'Generating Reference ID...' : 'Submit Order & Open WhatsApp'}
              </button>
            </form>
          </div>
        </div>

        <iframe
          title="NATH CAFE ZONE Map — Subhas More, Kanchrapara"
          className="map-frame"
          src="https://www.google.com/maps?q=Subhas%20More%20Kanchrapara%20743145&output=embed"
          loading="lazy"
        />
      </div>

      {receipt && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setReceipt(null)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow-label" style={{ marginBottom: 2 }}>
                  ENQUIRY LOGGED
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>
                  Order Reference Generated
                </h3>
              </div>
              <button
                type="button"
                className="modal-close"
                aria-label="Close confirmation"
                onClick={() => setReceipt(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="receipt-box">
                <div style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)' }}>
                  Reference ID
                </div>
                <div className="ref-code">{receipt.enquiry.refId}</div>
                <div style={{ marginTop: 10, fontSize: '0.9rem' }}>
                  <strong>{receipt.enquiry.name}</strong> • {receipt.enquiry.service}
                </div>
                {receipt.enquiry.quoteSummary && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', marginTop: 4 }}>
                    {receipt.enquiry.quoteSummary} (₹{receipt.enquiry.estimatedTotal})
                  </div>
                )}
              </div>

              <a
                href={receipt.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent"
                style={{ width: '100%' }}
              >
                Send Details on WhatsApp Now
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
