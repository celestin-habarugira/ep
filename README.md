# SCL Management (parallel version)

This copy contains the migrated React client and Express/MongoDB server. The existing project remains in place.

## Install

From this directory, install the lockfile dependencies for each package:

```powershell
npm ci
npm ci --prefix client
npm ci --prefix server
```

Create `server/.env` from `server/.env.example`, then set `MONGO_URI` and a private `JWT_SECRET`. The client defaults to `http://localhost:5000`; set `client/.env` with `VITE_API_URL` if the API runs elsewhere.

Run both apps with `npm run dev`. The client is served by Vite and the API listens on port 5000 by default.
