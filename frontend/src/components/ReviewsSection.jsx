import React, { useEffect, useState } from 'react';
import { Star, MessageSquarePlus, ExternalLink, X, CheckCircle2 } from 'lucide-react';
import { apiUrl } from '../config/api.js';

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/ns1XGQU9zexE9soU7';

function StarRow({ rating, size = 16 }) {
  const filled = Math.round(Number(rating) || 0);
  return (
    <div className="star-row" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          fill={n <= filled ? '#ff4d00' : 'none'}
          stroke={n <= filled ? '#ff4d00' : 'currentColor'}
          style={{ opacity: n <= filled ? 1 : 0.3 }}
        />
      ))}
    </div>
  );
}

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NC';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ReviewsSection({ googleMapsUrl = GOOGLE_MAPS_URL }) {
  const [reviewsData, setReviewsData] = useState({
    googleMapsUrl,
    googleSynced: false,
    ratingSummary: {
      average: null,
      totalCount: 0,
      localCount: 0,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    },
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    authorName: '',
    rating: 5,
    service: 'Printing',
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(apiUrl('/api/reviews'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.ok) return;
        setReviewsData(data);
      })
      .catch(() => {
        // Keep initial empty state if backend is unreachable
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(apiUrl('/api/reviews'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Unable to post your review.');
      } else {
        setReviewsData((prev) => ({
          ...prev,
          ratingSummary: data.ratingSummary || prev.ratingSummary,
          reviews: Array.isArray(data.reviews) ? data.reviews : [data.review, ...prev.reviews],
        }));
        setForm({ authorName: '', rating: 5, service: 'Printing', comment: '' });
        setModalOpen(false);
        setSubmittedNotice(true);
        setTimeout(() => setSubmittedNotice(false), 5000);
      }
    } catch {
      setError('Could not connect to the review server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const { ratingSummary, reviews, googleSynced } = reviewsData;
  const activeMapsLink = reviewsData.googleMapsUrl || googleMapsUrl;
  const breakdownTotal = Math.max(1, ratingSummary.localCount || reviews.length || 1);

  return (
    <section className="section section-dark" id="reviews">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="eyebrow-label">CUSTOMER REVIEWS</span>
            <h2 className="section-title">Verified Customer Feedback</h2>
            <p className="section-desc">
              Real experiences from Kanchrapara customers &amp; Google Maps visitors.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button
              type="button"
              className="btn btn-accent btn-sm"
              onClick={() => setModalOpen(true)}
            >
              <MessageSquarePlus size={16} />
              Write a Review
            </button>
            <a
              href={activeMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-dark btn-sm"
            >
              View on Google Maps
              <ExternalLink size={15} />
            </a>
          </div>
        </div>

        {submittedNotice && (
          <div className="reviews-toast" role="status">
            <CheckCircle2 size={18} color="#ff4d00" />
            <span>Thank you! Your review has been published live.</span>
          </div>
        )}

        <div className="reviews-overview-grid">
          <div className="reviews-score-card">
            <div className="reviews-score-top">
              <div>
                <div className="reviews-big-score">
                  {ratingSummary.average !== null ? ratingSummary.average.toFixed(1) : '—'}
                </div>
                <StarRow rating={ratingSummary.average || 0} size={18} />
                <div className="reviews-count-label">
                  {ratingSummary.totalCount > 0
                    ? `Based on ${ratingSummary.totalCount} review${ratingSummary.totalCount === 1 ? '' : 's'}`
                    : 'Be the first to review on our site'}
                </div>
              </div>
              <span className="review-sync-pill">
                {googleSynced ? 'Google Maps Synced' : 'Live Website + Google Link'}
              </span>
            </div>

            <div className="reviews-bars">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingSummary.breakdown?.[star] || 0;
                const pct = reviews.length > 0 ? Math.round((count / breakdownTotal) * 100) : 0;
                return (
                  <div key={star} className="review-bar-row">
                    <span>{star}★</span>
                    <div className="review-bar-track">
                      <div className="review-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="review-bar-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="reviews-cards-area">
            {loading ? (
              <div className="reviews-empty-card">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="reviews-empty-card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 8 }}>
                  No Website Reviews Yet
                </h3>
                <p style={{ color: 'var(--ink-muted-on-dark)', marginBottom: 18, fontSize: '0.92rem' }}>
                  Share your experience with NATH CAFE ZONE or view our customer ratings directly on
                  Google Maps.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-accent btn-sm"
                    onClick={() => setModalOpen(true)}
                  >
                    <MessageSquarePlus size={16} />
                    Add First Review
                  </button>
                  <a
                    href={activeMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-dark btn-sm"
                  >
                    Open Google Maps Reviews
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="reviews-grid">
                {reviews.map((rev) => (
                  <article key={rev.id} className="review-card">
                    <div className="review-card-head">
                      <div className="review-author-wrap">
                        {rev.authorPhoto ? (
                          <img
                            src={rev.authorPhoto}
                            alt={rev.authorName}
                            className="review-avatar-img"
                          />
                        ) : (
                          <div className="review-avatar-fallback">{getInitials(rev.authorName)}</div>
                        )}
                        <div>
                          <div className="review-author-name">{rev.authorName}</div>
                          <div className="review-date">{rev.relativeTime || 'Verified Customer'}</div>
                        </div>
                      </div>
                      <span className="review-source-tag">{rev.source || 'Website'}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0 10px' }}>
                      <StarRow rating={rev.rating} size={15} />
                      {rev.service && <span className="review-service-pill">{rev.service}</span>}
                    </div>

                    <p className="review-comment">{rev.comment}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setModalOpen(false)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow-label" style={{ marginBottom: 2 }}>
                  SHARE FEEDBACK
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>
                  Review NATH CAFE ZONE
                </h3>
              </div>
              <button
                type="button"
                className="modal-close"
                aria-label="Close review modal"
                onClick={() => setModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert-banner" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmitReview}>
                <div className="field-group">
                  <span className="field-label">Your Rating</span>
                  <div className="rating-picker" role="radiogroup" aria-label="Star rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`rating-star-btn ${form.rating >= star ? 'active' : ''}`}
                        onClick={() => setForm({ ...form, rating: star })}
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          size={22}
                          fill={form.rating >= star ? '#ff4d00' : 'none'}
                          stroke={form.rating >= star ? '#ff4d00' : 'currentColor'}
                        />
                      </button>
                    ))}
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, marginLeft: 6 }}>
                      {form.rating} / 5
                    </span>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="field-group">
                    <label className="field-label" htmlFor="rev-name">
                      Your Name
                    </label>
                    <input
                      id="rev-name"
                      type="text"
                      className="field-input"
                      placeholder="e.g. Anirban Sen"
                      value={form.authorName}
                      onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="rev-service">
                      Service Used
                    </label>
                    <select
                      id="rev-service"
                      className="field-select"
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                    >
                      <option value="Printing">Document / Colour Printing</option>
                      <option value="Flex Printing">Flex Banner Printing</option>
                      <option value="Vinyl Printing">Vinyl &amp; Stickers</option>
                      <option value="Trophy & Medal">Trophy &amp; Medal</option>
                      <option value="Button Badges">Button Badges</option>
                      <option value="Cyber Cafe & Recharge">Cyber Cafe &amp; Recharge</option>
                    </select>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="rev-comment">
                    Your Experience
                  </label>
                  <textarea
                    id="rev-comment"
                    rows="3"
                    className="field-textarea"
                    placeholder="How was the print quality, pricing, or service speed?"
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-accent"
                  style={{ width: '100%' }}
                  disabled={submitting}
                >
                  {submitting ? 'Publishing Review...' : 'Publish Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
