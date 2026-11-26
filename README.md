# NATH CAFE ZONE — Full-Stack Monorepo

Split into independent **`frontend/`** (Vercel) and **`backend/`** (Render) folders, preserving [NATH.HTML](NATH.HTML) as the original reference.

## Folder Structure

- `frontend/` — React + Vite SPA (`90%` Obsidian/Studio Neutrals + `10%` Signal Orange `#FF4D00` accent)
- `backend/` — Node.js + Express.js REST API (`GET /api/health`, `GET /api/services`, `POST /api/estimate`, `POST /api/enquiries`, `GET /api/enquiries/:refId`)
- `render.yaml` — Render Blueprint pointing to `backend/`

---

## 1. Deploy Backend on Render

1. Push this repository to GitHub.
2. On **Render**, click **New + → Web Service** and connect your GitHub repo.
3. Configure:
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
4. Copy your live Render URL (for example: `https://nath-cafe-zone-api.onrender.com`).
5. *(After deploying Vercel)* Add an environment variable on Render:
   - `ALLOWED_ORIGINS` = `https://your-project.vercel.app` (comma-separated if you also have a custom domain).

---

## 2. Deploy Frontend on Vercel

1. On **Vercel**, click **Add New → Project** and import the same GitHub repo.
2. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add an environment variable in Vercel:
   - `VITE_API_BASE_URL` = `https://nath-cafe-zone-api.onrender.com` *(your Render URL, no trailing slash)*
4. Click **Deploy**.

---

## 3. Run Locally

Terminal 1 (Backend on `http://localhost:3000`):
```bash
cd backend
npm install
npm start
```

Terminal 2 (Frontend on `http://localhost:5173`, proxies `/api` to `:3000`):
```bash
cd frontend
npm install
npm run dev
```
