import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const GOOGLE_SNAPSHOT_FILE = path.join(DATA_DIR, 'googleReviewsSnapshot.json');

export const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/ns1XGQU9zexE9soU7';

const CACHE_TTL_MS = 30 * 60 * 1000;
let googleCache = {
  fetchedAt: 0,
  data: null,
};

async function ensureJsonFile(filePath, defaultContent = '[]') {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, defaultContent, 'utf8');
  }
}

async function readJsonArray(filePath) {
  await ensureJsonFile(filePath, '[]');
  const raw = await fs.readFile(filePath, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeJsonArray(filePath, items) {
  await ensureJsonFile(filePath, '[]');
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf8');
}

/**
 * Fetches live reviews from Google Places API (New v1) when
 * GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID are configured.
 */
async function fetchLiveGoogleReviews() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();

  if (!apiKey || !placeId) {
    return null;
  }

  const now = Date.now();
  if (googleCache.data && now - googleCache.fetchedAt < CACHE_TTL_MS) {
    return googleCache.data;
  }

  try {
    const endpoint = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
    const res = await fetch(endpoint, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews,googleMapsUri',
      },
    });

    if (!res.ok) {
      console.warn(`Google Places API returned HTTP ${res.status}`);
      return googleCache.data;
    }

    const payload = await res.json();
    const mappedReviews = (payload.reviews || []).map((rev, idx) => ({
      id: `google-${rev.name || idx}`,
      authorName: rev.authorAttribution?.displayName || 'Google Reviewer',
      authorPhoto: rev.authorAttribution?.photoUri || null,
      authorUrl: rev.authorAttribution?.uri || null,
      rating: Number(rev.rating) || 5,
      comment: rev.text?.text || rev.originalText?.text || '',
      relativeTime: rev.relativePublishTimeDescription || 'On Google Maps',
      createdAt: rev.publishTime || new Date().toISOString(),
      service: 'Google Review',
      source: 'Google Maps',
    }));

    const result = {
      placeName: payload.displayName?.text || 'NATH CAFE ZONE',
      googleRating: Number(payload.rating) || null,
      googleTotalCount: Number(payload.userRatingCount) || mappedReviews.length,
      googleMapsUri: payload.googleMapsUri || GOOGLE_MAPS_URL,
      reviews: mappedReviews,
    };

    googleCache = { fetchedAt: now, data: result };
    return result;
  } catch (err) {
    console.warn('Failed to fetch live Google Places reviews:', err.message);
    return googleCache.data;
  }
}

export async function getAllReviewsPayload() {
  const [siteReviews, snapshotReviews, liveGoogle] = await Promise.all([
    readJsonArray(REVIEWS_FILE),
    readJsonArray(GOOGLE_SNAPSHOT_FILE),
    fetchLiveGoogleReviews(),
  ]);

  const googleReviews = liveGoogle ? liveGoogle.reviews : snapshotReviews;
  const combined = [...siteReviews, ...googleReviews].sort((a, b) => {
    const ta = new Date(a.createdAt || 0).getTime();
    const tb = new Date(b.createdAt || 0).getTime();
    return tb - ta;
  });

  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;
  for (const item of combined) {
    const r = Math.min(5, Math.max(1, Math.round(Number(item.rating) || 5)));
    breakdown[r] += 1;
    sum += r;
  }

  const computedAverage = combined.length ? Number((sum / combined.length).toFixed(1)) : null;

  return {
    ok: true,
    googleMapsUrl: liveGoogle?.googleMapsUri || GOOGLE_MAPS_URL,
    googleSynced: Boolean(liveGoogle),
    ratingSummary: {
      average: liveGoogle?.googleRating && siteReviews.length === 0 ? liveGoogle.googleRating : computedAverage,
      totalCount: liveGoogle?.googleTotalCount
        ? liveGoogle.googleTotalCount + siteReviews.length
        : combined.length,
      localCount: combined.length,
      breakdown,
    },
    reviews: combined,
  };
}

export async function addWebsiteReview({ authorName, rating, service, comment }) {
  const cleanName = String(authorName || '').trim();
  const cleanService = String(service || 'General').trim() || 'General';
  const cleanComment = String(comment || '').trim();
  const numericRating = Math.round(Number(rating));

  if (cleanName.length < 2 || cleanName.length > 60) {
    throw Object.assign(new Error('Please enter your name (2–60 characters).'), { statusCode: 400 });
  }

  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    throw Object.assign(new Error('Please select a star rating between 1 and 5.'), { statusCode: 400 });
  }

  if (cleanComment.length < 4 || cleanComment.length > 600) {
    throw Object.assign(new Error('Please write a review between 4 and 600 characters.'), {
      statusCode: 400,
    });
  }

  const newReview = {
    id: `site-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    authorName: cleanName,
    rating: numericRating,
    service: cleanService,
    comment: cleanComment,
    relativeTime: 'Just now',
    createdAt: new Date().toISOString(),
    source: 'Website',
  };

  const existing = await readJsonArray(REVIEWS_FILE);
  existing.unshift(newReview);
  await writeJsonArray(REVIEWS_FILE, existing.slice(0, 300));

  return newReview;
}
