# EP. Cyumushyika School Management System

EP. Cyumushyika is a responsive school administration dashboard for managing student records, attendance, academic performance, employees, and staff communication. The dashboard summarizes enrollment, daily attendance, attendance follow-up, and academic results. Staff can filter the daily attendance report by date and download it as a CSV file.

## Features

- **Dashboard:** enrollment and staff totals, current-year performance averages, attendance completion, absent and late student follow-up, recent results, and section shortcuts.
- **Daily reports:** choose a school date, review present, absent, late, and excused counts, inspect students needing follow-up, and download a date-stamped CSV report.
- **Students:** search, add, edit, and deactivate student records.
- **Attendance:** record present, absent, late, or excused status for each active student by date.
- **Performance:** add, edit, and remove subject results, with student, term, year, score, grade, and comments.
- **Employees:** view staff; administrators can create, edit, and deactivate employee accounts.
- **Chat:** staff direct messages, groups, announcements, file and image sharing, reactions, and calling features.
- **Profiles:** upload employee profile photos and show them in staff and chat views.
- **Responsive layouts:** navigation, dashboards, forms, tables, modals, and chat panels adapt to phone, tablet, and desktop widths.

## Technology

- React 18 and Vite for the client
- Express and Node.js for the API
- MongoDB with Mongoose for data storage
- Socket.IO for live chat and presence
- Cloudinary for hosted profile and chat images
- Vercel for the client and Render for the API

## Project layout

```text
client/   React application, Vite configuration, and client environment settings
server/   Express API, database models, controllers, routes, and upload handling
```

## Local development

Install dependencies from the repository root:

```sh
npm ci
npm ci --prefix client
npm ci --prefix server
```

Create `server/.env` and configure the values below. For local API development, create `client/.env` and set `VITE_API_URL=http://localhost:5000`. To use the deployed API from the client, use `VITE_API_URL=https://ep-0n86.onrender.com`.

Run both apps from the repository root:

```sh
npm run dev
```

The Vite client runs on port 3000. The API uses `PORT` when set and otherwise listens on port 5000.

## Environment variables

### API (`server/.env`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URI` or `MONGODB_URI` | Yes | MongoDB connection string. `MONGO_URI` takes precedence if both are set. |
| `JWT_SECRET` | Yes | Private signing secret for authentication tokens. Use a long, random value. |
| `PORT` | No | API listening port. Render supplies this automatically. |
| `JWT_EXPIRE` | No | Token lifetime; the app uses `30d` in its example configuration. |
| `CORS_ORIGIN` | No | Additional allowed browser origins, separated by commas. The production Vercel origin is allowed by default. |
| `CLOUDINARY_URL` | Required for image uploads | Cloudinary account URL used to store profile and chat images. Keep it private. |

### Client (`client/.env`)

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | No | API base URL. Defaults to `https://ep-0n86.onrender.com`. |

Never commit `.env` files or real credentials. Set production values in the hosting provider’s environment settings.

## Build and deployment

Build the client from the repository root:

```sh
npm run build
```

For a Vercel client deployment, use the repository root, build command `npm run build`, and output directory `client/dist`. Set `VITE_API_URL` to `https://ep-0n86.onrender.com` in the Vercel project settings if that value is already configured there.

For the Render API web service, set the root directory to `server`, build command to `npm ci`, and start command to `npm start`. Configure `MONGO_URI`, `JWT_SECRET`, and `CLOUDINARY_URL` in Render. The API allows `https://epkimushyika.vercel.app` through CORS by default.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the client and API together for development. |
| `npm run build` | Install client dependencies from its lockfile and create the production client build. |
| `npm start --prefix server` | Start the API. |
| `npm run seed --prefix server` | Run the server data seed script. |
