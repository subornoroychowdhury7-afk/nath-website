import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SHOP_INFO,
  SERVICES,
  GALLERY_ITEMS,
  calculateEstimate,
} from './servicesCatalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (curl, Render health checks) or when ALLOWED_ORIGINS is not restricted
      if (!origin || configuredOrigins.length === 0) {
        return callback(null, true);
      }
      if (configuredOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json({ limit: '256kb' }));

async function ensureDataStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(ENQUIRIES_FILE);
  } catch {
    await fs.writeFile(ENQUIRIES_FILE, '[]', 'utf8');
  }
}

async function readEnquiries() {
  await ensureDataStore();
  const raw = await fs.readFile(ENQUIRIES_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeEnquiries(items) {
  await ensureDataStore();
  await fs.writeFile(ENQUIRIES_FILE, JSON.stringify(items, null, 2), 'utf8');
}

function getShopOpenStatus() {
  const now = new Date();
  const istMinutes =
    now.getUTCHours() * 60 + now.getUTCMinutes() + 5 * 60 + 30;
  const normalizedMinutes = ((istMinutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalizedMinutes / 60);
  const isOpen =
    hour >= SHOP_INFO.hours.openHour && hour < SHOP_INFO.hours.closeHour;
  return {
    isOpen,
    label: isOpen ? 'Open Now • Subhas More' : 'Closed • Opens 10:00 AM IST',
    hours: SHOP_INFO.hours.display,
  };
}

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: `${SHOP_INFO.name} API`,
    health: '/api/health',
    endpoints: ['/api/health', '/api/services', '/api/estimate', '/api/enquiries'],
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: SHOP_INFO.name,
    status: getShopOpenStatus(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/services', (_req, res) => {
  res.json({
    shop: SHOP_INFO,
    status: getShopOpenStatus(),
    services: SERVICES,
    gallery: GALLERY_ITEMS,
  });
});

app.post('/api/estimate', (req, res) => {
  const estimate = calculateEstimate(req.body || {});
  res.json({ ok: true, estimate });
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const {
      name = '',
      phone = '',
      service = 'Printing',
      message = '',
      quoteSummary = '',
      estimatedTotal = null,
    } = req.body || {};

    const cleanName = String(name).trim();
    const cleanPhone = String(phone).replace(/\s+/g, '').trim();
    const cleanMessage = String(message).trim();
    const cleanService = String(service).trim() || 'General';

    if (cleanName.length < 2) {
      return res
        .status(400)
        .json({ ok: false, error: 'Please enter your full name.' });
    }

    if (!/^[+\d][\d-]{7,15}$/.test(cleanPhone)) {
      return res
        .status(400)
        .json({ ok: false, error: 'Please enter a valid mobile number.' });
    }

    if (cleanMessage.length < 4) {
      return res
        .status(400)
        .json({ ok: false, error: 'Please describe your requirement briefly.' });
    }

    const refId = `NCZ-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const record = {
      refId,
      name: cleanName,
      phone: cleanPhone,
      service: cleanService,
      message: cleanMessage,
      quoteSummary: quoteSummary ? String(quoteSummary).trim() : null,
      estimatedTotal:
        estimatedTotal !== null && Number.isFinite(Number(estimatedTotal))
          ? Number(estimatedTotal)
          : null,
      status: 'Received',
      createdAt: new Date().toISOString(),
    };

    const existing = await readEnquiries();
    existing.unshift(record);
    await writeEnquiries(existing.slice(0, 200));

    const whatsappLines = [
      `Hello NATH CAFE ZONE (Ref: ${refId}),`,
      '',
      `Name: ${record.name}`,
      `Mobile: ${record.phone}`,
      `Service: ${record.service}`,
      record.quoteSummary
        ? `Estimate: ${record.quoteSummary} (Approx ₹${record.estimatedTotal})`
        : null,
      '',
      'Requirement:',
      record.message,
    ].filter((line) => line !== null);

    const whatsappUrl = `https://wa.me/${SHOP_INFO.whatsappNumber}?text=${encodeURIComponent(
      whatsappLines.join('\n')
    )}`;

    res.status(201).json({
      ok: true,
      enquiry: record,
      whatsappUrl,
    });
  } catch (err) {
    console.error('Failed to save enquiry:', err);
    res.status(500).json({
      ok: false,
      error: 'Unable to submit enquiry right now. Please try WhatsApp directly.',
    });
  }
});

app.get('/api/enquiries/:refId', async (req, res) => {
  try {
    const target = String(req.params.refId || '').trim().toUpperCase();
    const list = await readEnquiries();
    const found = list.find((item) => item.refId === target);
    if (!found) {
      return res
        .status(404)
        .json({ ok: false, error: 'No enquiry found with that Reference ID.' });
    }
    res.json({
      ok: true,
      enquiry: {
        refId: found.refId,
        name: found.name,
        service: found.service,
        status: found.status,
        quoteSummary: found.quoteSummary,
        estimatedTotal: found.estimatedTotal,
        createdAt: found.createdAt,
      },
    });
  } catch (err) {
    console.error('Lookup failed:', err);
    res.status(500).json({ ok: false, error: 'Lookup service unavailable.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NATH CAFE ZONE backend listening on http://0.0.0.0:${PORT}`);
});
