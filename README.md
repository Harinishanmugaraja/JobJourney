# Job Application Tracker (MERN Style with Mock Data)

7376231CS166 - HARINI S

A full-stack Job Application Tracker following three-tier architecture:
- Presentation Layer: React.js dashboard UI
- Application Layer: Express.js REST APIs
- Data Layer: Mock repository (JSON arrays) structured for easy MongoDB migration

## Folder Structure

```text
job-tracker
+-- backend
¦   +-- config
¦   ¦   +-- db.js
¦   +-- controllers
¦   ¦   +-- applicationController.js
¦   ¦   +-- authController.js
¦   ¦   +-- interviewController.js
¦   +-- data
¦   ¦   +-- mockDb.js
¦   +-- middleware
¦   ¦   +-- authMiddleware.js
¦   ¦   +-- roleMiddleware.js
¦   +-- models
¦   ¦   +-- Application.js
¦   ¦   +-- Interview.js
¦   ¦   +-- User.js
¦   +-- routes
¦   ¦   +-- applicationRoutes.js
¦   ¦   +-- authRoutes.js
¦   ¦   +-- interviewRoutes.js
¦   +-- package.json
¦   +-- server.js
+-- frontend
¦   +-- public
¦   ¦   +-- index.html
¦   +-- src
¦   ¦   +-- components
¦   ¦   +-- context
¦   ¦   +-- pages
¦   ¦   +-- services
¦   ¦   +-- styles
¦   ¦   +-- App.js
¦   ¦   +-- index.js
¦   +-- package.json
+-- README.md
```

## Tech Stack

- Frontend: React.js, React Router, Axios, Custom CSS
- Backend: Node.js, Express.js
- Auth: JWT, bcryptjs
- Database Layer: Mock arrays (MongoDB-ready architecture)

## Implemented Features

- User Registration/Login with email validation and password hashing
- Role-based access (`jobseeker`, `employer`, `admin`)
- Role-specific dashboards
- Job application creation and tracking
- Resume extension validation (`.pdf`, `.doc`, `.docx`)
- Interview scheduling by employer/admin
- Search and filter by status/company/date/role
- Reusable UI components (Navbar, Sidebar, Cards, Table, Status Badge, Modal, Notifications)
- Dark gradient dashboard with responsive layout, hover glow, transitions, loaders, toast notifications

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Applications
- `POST /api/applications`
- `GET /api/applications`
- `PUT /api/applications/:id`
- `DELETE /api/applications/:id`

### Interviews
- `POST /api/interviews`
- `GET /api/interviews`
- `PUT /api/interviews/:id`

## Mock Test Accounts

- Admin: `admin@jobtracker.com` / `Admin@123`
- Employer: `employer@jobtracker.com` / `Employer@123`
- Job Seeker: `jobseeker@jobtracker.com` / `JobSeeker@123`

## Run Instructions

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
JWT_SECRET=replace-with-a-strong-secret
```

Optional `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## MongoDB Migration Path (Later)

- Replace `backend/data/mockDb.js` with Mongoose models and DB queries
- Enable actual connection logic in `backend/config/db.js`
- Keep controllers/routes unchanged for minimal migration effort

## Non-Functional Notes

- Designed for quick API response in local mock mode
- Passwords are encrypted using bcrypt
- JWT-secured APIs
- Input validation on both frontend and backend
- Responsive UI for desktop/mobile
