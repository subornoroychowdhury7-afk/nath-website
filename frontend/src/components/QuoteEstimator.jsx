import React, { useEffect, useState } from 'react';
import { Printer, Signpost, Trophy, Award, ArrowRight } from 'lucide-react';
import { apiUrl } from '../config/api.js';
import { calculateEstimateLocal } from '../data/fallbackCatalog.js';

const TABS = [
  { id: 'printing', label: 'Document Print', icon: Printer },
  { id: 'flex-vinyl', label: 'Flex & Vinyl', icon: Signpost },
  { id: 'trophy-medal', label: 'Trophy & Medal', icon: Trophy },
  { id: 'button-badges', label: 'Button Badges', icon: Award },
];

export default function QuoteEstimator({ activeTab, onTabChange, onLockQuote }) {
  const [printing, setPrinting] = useState({
    pages: 25,
    colorMode: 'bw',
    paperSize: 'A4',
    binding: false,
    lamination: false,
  });

  const [flexVinyl, setFlexVinyl] = useState({
    widthFt: 6,
    heightFt: 3,
    media: 'black-media-flex',
    quantity: 1,
    grommets: true,
  });

  const [trophyMedal, setTrophyMedal] = useState({
    itemKind: 'trophy',
    tier: 'standard',
    quantity: 10,
    engraving: true,
  });

  const [badges, setBadges] = useState({
    quantity: 50,
    size: '58mm',
    backing: 'pin',
  });

  const currentPayload =
    activeTab === 'printing'
      ? { type: 'printing', ...printing }
      : activeTab === 'flex-vinyl'
      ? { type: 'flex-vinyl', ...flexVinyl }
      : activeTab === 'trophy-medal'
      ? { type: 'trophy-medal', ...trophyMedal }
      : { type: 'button-badges', ...badges };

  const [estimate, setEstimate] = useState(() => calculateEstimateLocal(currentPayload));

  useEffect(() => {
    const localResult = calculateEstimateLocal(currentPayload);
    setEstimate(localResult);

    let cancelled = false;
    fetch(apiUrl('/api/estimate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentPayload),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.ok && data.estimate) {
          setEstimate(data.estimate);
        }
      })
      .catch(() => {
        // Fallback already applied smoothly
      });

    return () => {
      cancelled = true;
    };
  }, [
    activeTab,
    printing.pages,
    printing.colorMode,
    printing.paperSize,
    printing.binding,
    printing.lamination,
    flexVinyl.widthFt,
    flexVinyl.heightFt,
    flexVinyl.media,
    flexVinyl.quantity,
    flexVinyl.grommets,
    trophyMedal.itemKind,
    trophyMedal.tier,
    trophyMedal.quantity,
    trophyMedal.engraving,
    badges.quantity,
    badges.size,
    badges.backing,
  ]);

  const handleLock = () => {
    const serviceMap = {
      printing: 'Printing',
      'flex-vinyl': flexVinyl.media.includes('vinyl') ? 'Vinyl Printing' : 'Flex Printing',
      'trophy-medal': 'Trophy & Medal',
      'button-badges': 'Button Badge',
    };
    onLockQuote({
      service: serviceMap[activeTab] || 'Printing',
      quoteSummary: estimate.summary,
      estimatedTotal: estimate.total,
    });
  };

  return (
    <section className="section section-light" id="estimator">
      <div className="container">
        <div className="section-header-center">
          <span className="eyebrow-label">TRANSPARENT PRICING</span>
          <h2 className="section-title">Instant Project Cost Estimator</h2>
          <p className="section-desc">
            Configure paper, banner dimensions, trophies, or bulk badges to get an instant ballpark
            quote and lock it into your order.
          </p>
        </div>

        <div className="estimator-shell">
          <div className="estimator-controls">
            <div className="estimator-tabs" role="tablist">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`est-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === 'printing' && (
              <div>
                <div className="form-grid-2">
                  <div className="field-group">
                    <label className="field-label" htmlFor="est-pages">
                      Number of Pages
                    </label>
                    <input
                      id="est-pages"
                      type="number"
                      min="1"
                      max="10000"
                      className="field-input"
                      value={printing.pages}
                      onChange={(e) =>
                        setPrinting({ ...printing, pages: Math.max(1, Number(e.target.value) || 1) })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="est-color">
                      Print Mode
                    </label>
                    <select
                      id="est-color"
                      className="field-select"
                      value={printing.colorMode}
                      onChange={(e) => setPrinting({ ...printing, colorMode: e.target.value })}
                    >
                      <option value="bw">Black &amp; White Laser</option>
                      <option value="color">Full Colour Laser</option>
                    </select>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="est-size">
                    Paper Size
                  </label>
                  <select
                    id="est-size"
                    className="field-select"
                    value={printing.paperSize}
                    onChange={(e) => setPrinting({ ...printing, paperSize: e.target.value })}
                  >
                    <option value="A4">A4 Standard (75–100 GSM)</option>
                    <option value="A3">A3 Large Format</option>
                  </select>
                </div>

                <div className="checkbox-row">
                  <label className="checkbox-pill">
                    <input
                      type="checkbox"
                      checked={printing.binding}
                      onChange={(e) => setPrinting({ ...printing, binding: e.target.checked })}
                    />
                    Spiral Binding (+₹35)
                  </label>
                  <label className="checkbox-pill">
                    <input
                      type="checkbox"
                      checked={printing.lamination}
                      onChange={(e) => setPrinting({ ...printing, lamination: e.target.checked })}
                    />
                    Lamination (+₹15/page)
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'flex-vinyl' && (
              <div>
                <div className="form-grid-2">
                  <div className="field-group">
                    <label className="field-label" htmlFor="est-w">
                      Width (feet)
                    </label>
                    <input
                      id="est-w"
                      type="number"
                      min="1"
                      max="100"
                      className="field-input"
                      value={flexVinyl.widthFt}
                      onChange={(e) =>
                        setFlexVinyl({
                          ...flexVinyl,
                          widthFt: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="est-h">
                      Height (feet)
                    </label>
                    <input
                      id="est-h"
                      type="number"
                      min="1"
                      max="100"
                      className="field-input"
                      value={flexVinyl.heightFt}
                      onChange={(e) =>
                        setFlexVinyl({
                          ...flexVinyl,
                          heightFt: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="field-group">
                    <label className="field-label" htmlFor="est-media">
                      Material / Media
                    </label>
                    <select
                      id="est-media"
                      className="field-select"
                      value={flexVinyl.media}
                      onChange={(e) => setFlexVinyl({ ...flexVinyl, media: e.target.value })}
                    >
                      <option value="normal-flex">Normal Flex (₹12/sq.ft)</option>
                      <option value="black-media-flex">Black Media Flex (₹15/sq.ft)</option>
                      <option value="vinyl">Adhesive Vinyl (₹25/sq.ft)</option>
                      <option value="vinyl-sunboard">Vinyl + Sunboard Mount (₹95/sq.ft)</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="est-fqty">
                      Quantity
                    </label>
                    <input
                      id="est-fqty"
                      type="number"
                      min="1"
                      max="100"
                      className="field-input"
                      value={flexVinyl.quantity}
                      onChange={(e) =>
                        setFlexVinyl({
                          ...flexVinyl,
                          quantity: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="checkbox-row">
                  <label className="checkbox-pill">
                    <input
                      type="checkbox"
                      checked={flexVinyl.grommets}
                      onChange={(e) => setFlexVinyl({ ...flexVinyl, grommets: e.target.checked })}
                    />
                    Metal Eyelets / Hanging Rings
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'trophy-medal' && (
              <div>
                <div className="form-grid-2">
                  <div className="field-group">
                    <label className="field-label" htmlFor="est-kind">
                      Award Type
                    </label>
                    <select
                      id="est-kind"
                      className="field-select"
                      value={trophyMedal.itemKind}
                      onChange={(e) => setTrophyMedal({ ...trophyMedal, itemKind: e.target.value })}
                    >
                      <option value="trophy">Customized Trophy</option>
                      <option value="medal">Custom Medal with Ribbon</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="est-tier">
                      Finish Tier
                    </label>
                    <select
                      id="est-tier"
                      className="field-select"
                      value={trophyMedal.tier}
                      onChange={(e) => setTrophyMedal({ ...trophyMedal, tier: e.target.value })}
                    >
                      <option value="standard">Standard Classic</option>
                      <option value="premium">Premium Metallic</option>
                      <option value="custom-acrylic">Custom Acrylic / Crest</option>
                    </select>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="est-tqty">
                    Quantity (Bulk discount at 20+ and 50+)
                  </label>
                  <input
                    id="est-tqty"
                    type="number"
                    min="1"
                    max="1000"
                    className="field-input"
                    value={trophyMedal.quantity}
                    onChange={(e) =>
                      setTrophyMedal({
                        ...trophyMedal,
                        quantity: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                  />
                </div>

                <div className="checkbox-row">
                  <label className="checkbox-pill">
                    <input
                      type="checkbox"
                      checked={trophyMedal.engraving}
                      onChange={(e) =>
                        setTrophyMedal({ ...trophyMedal, engraving: e.target.checked })
                      }
                    />
                    Custom Nameplate &amp; Logo Engraving
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'button-badges' && (
              <div>
                <div className="form-grid-2">
                  <div className="field-group">
                    <label className="field-label" htmlFor="est-bqty">
                      Quantity (Min 10 pcs)
                    </label>
                    <input
                      id="est-bqty"
                      type="number"
                      min="10"
                      max="5000"
                      className="field-input"
                      value={badges.quantity}
                      onChange={(e) =>
                        setBadges({ ...badges, quantity: Math.max(10, Number(e.target.value) || 10) })
                      }
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="est-bsize">
                      Badge Diameter
                    </label>
                    <select
                      id="est-bsize"
                      className="field-select"
                      value={badges.size}
                      onChange={(e) => setBadges({ ...badges, size: e.target.value })}
                    >
                      <option value="44mm">44mm Compact</option>
                      <option value="58mm">58mm Standard Event</option>
                    </select>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="est-bback">
                    Backing Hardware
                  </label>
                  <select
                    id="est-bback"
                    className="field-select"
                    value={badges.backing}
                    onChange={(e) => setBadges({ ...badges, backing: e.target.value })}
                  >
                    <option value="pin">Safety Pin Back</option>
                    <option value="magnet">Magnetic Back (+₹12/unit)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="estimator-summary">
            <div>
              <span className="eyebrow-label">LIVE ESTIMATE</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem' }}>
                Estimated Project Total
              </h3>

              <div className="quote-price-box">
                <div className="quote-amount">₹{estimate.total?.toLocaleString('en-IN')}</div>
                {estimate.discountApplied && (
                  <span className="discount-chip">{estimate.discountApplied}</span>
                )}

                <div className="quote-meta-list">
                  <div className="quote-meta-row">
                    <span>Specification</span>
                    <strong style={{ textAlign: 'right' }}>{estimate.summary}</strong>
                  </div>
                  {estimate.unitRate ? (
                    <div className="quote-meta-row">
                      <span>Effective Rate</span>
                      <strong>₹{estimate.unitRate} / unit</strong>
                    </div>
                  ) : null}
                  <div className="quote-meta-row">
                    <span>Est. Turnaround</span>
                    <strong>{estimate.turnaround}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                className="btn btn-accent"
                style={{ width: '100%' }}
                onClick={handleLock}
              >
                Lock Quote &amp; Send Order
                <ArrowRight size={17} />
              </button>
              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--ink-muted-on-dark)',
                  marginTop: 10,
                  textAlign: 'center',
                }}
              >
                Final artwork &amp; paper stock confirmed at our Subhas More counter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
