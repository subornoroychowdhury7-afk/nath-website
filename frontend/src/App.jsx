import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { apiUrl } from './config/api.js';
import { SHOP_INFO, SERVICES, GALLERY_ITEMS } from './data/fallbackCatalog.js';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ServicesSection from './components/ServicesSection.jsx';
import QuoteEstimator from './components/QuoteEstimator.jsx';
import AboutWhyGallery from './components/AboutWhyGallery.jsx';
import ReviewsSection from './components/ReviewsSection.jsx';
import ContactHub from './components/ContactHub.jsx';

export default function App() {
  const [shopInfo, setShopInfo] = useState(SHOP_INFO);
  const [services, setServices] = useState(SERVICES);
  const [gallery, setGallery] = useState(GALLERY_ITEMS);
  const [shopStatus, setShopStatus] = useState(null);
  const [estimatorTab, setEstimatorTab] = useState('printing');
  const [prefillQuote, setPrefillQuote] = useState(null);

  useEffect(() => {
    let active = true;
    fetch(apiUrl('/api/services'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        if (data.shop) setShopInfo(data.shop);
        if (Array.isArray(data.services)) setServices(data.services);
        if (Array.isArray(data.gallery)) setGallery(data.gallery);
        if (data.status) setShopStatus(data.status);
      })
      .catch(() => {
        // Fallback data already loaded
      });
    return () => {
      active = false;
    };
  }, []);

  const handleRequestQuoteFromService = (service) => {
    const tabMap = {
      printing: 'printing',
      'flex-printing': 'flex-vinyl',
      'vinyl-printing': 'flex-vinyl',
      'trophy-medal': 'trophy-medal',
      'button-badges': 'button-badges',
    };

    if (tabMap[service.id]) {
      setEstimatorTab(tabMap[service.id]);
      document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setPrefillQuote({ service: 'Mobile Recharge', quoteSummary: '', estimatedTotal: null });
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLockQuote = (quoteData) => {
    setPrefillQuote(quoteData);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar shopStatus={shopStatus} />
      <main>
        <Hero onSelectEstimatorTab={setEstimatorTab} />
        <ServicesSection services={services} onRequestQuote={handleRequestQuoteFromService} />
        <QuoteEstimator
          activeTab={estimatorTab}
          onTabChange={setEstimatorTab}
          onLockQuote={handleLockQuote}
        />
        <AboutWhyGallery gallery={gallery} />
        <ReviewsSection googleMapsUrl={shopInfo.googleMapsUrl} />
        <ContactHub
          shopInfo={shopInfo}
          prefillQuote={prefillQuote}
          onClearPrefill={() => setPrefillQuote(null)}
        />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <img
                src="/logo.jpg"
                alt="NATH CAFE ZONE Logo"
                style={{
                  height: '36px',
                  width: '36px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              />
              <div className="brand-logo">
                NATH <span className="accent-word">CAFE ZONE</span>
              </div>
            </div>
            <p className="footer-muted">
              {shopInfo.tagline} • Subhas More, Kanchrapara (743145)
            </p>
          </div>
          <p className="footer-muted">
            © {new Date().getFullYear()} NATH CAFE ZONE. All Rights Reserved.
          </p>
        </div>
      </footer>

      <a
        className="floating-cta"
        href={`https://wa.me/${shopInfo.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
      >
        <MessageSquare size={18} />
        Quick Chat
      </a>
    </>
  );
}
