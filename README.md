# 🏥 HealthCarePro - Multi-Hospital Healthcare Platform

HealthCarePro is a modern, state-of-the-art Multi-Hospital scheduling, doctor shift management, and live patient booking platform. It provides tailored portals for Patients, Doctors, Hospital Admins, and Platform Super Admins.

---

## 🚀 Features

### 👤 Patient Portal
- **Advanced Doctor & Hospital Search**: Find healthcare providers based on city, hospital, specialty, and ratings.
- **Live Slot Booking**: View real-time availability (weekly schedule & date-specific overrides) and instantly book appointments.
- **Prescription & History Dashboard**: View issued digital prescriptions and clinical history.
- **Reviews & Ratings**: Post reviews and rate hospitals and doctors after appointments.

### 🩺 Doctor Portal
- **Shift & Slot Management**: Set standard weekly working hours per hospital and add custom date overrides for leaves or urgent adjustments.
- **Live Appointments Console**: View today's schedule, update appointment status (confirmed, completed, cancelled), and issue digital prescriptions.

### 🏢 Hospital Admin Portal
- **Department Administration**: Create and manage clinical departments.
- **Doctor Roster**: Approve and add doctors, manage qualifications, fees, and shifts.
- **Settings & Capacity**: Manage hospital details, address, bed counts, emergency capabilities, and review customer feedback.

### 👑 Super Admin Dashboard
- **Platform Analytics**: Monitor overall platform appointments, registration trends, and activity metrics.
- **Hospital Onboarding**: Verify, approve, or reject new hospital registrations.
- **User Control**: Deactivate or activate accounts across the entire platform.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS 4, Framer Motion (Micro-animations), Lucide React (Icons), Recharts (Analytics charts).
- **Backend**: Node.js, Express 5, MongoDB, Mongoose, JWT (Authentication), Cloudinary (Media storage).

---

## 📂 Project Structure

```
hospital-management/
├── client/                 # React 19 frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI elements (Hero, Navbar, ProtectRoute, etc.)
│   │   ├── context/        # Authentication & global application states
│   │   ├── layouts/        # Dashboard layout systems
│   │   ├── pages/          # Pages grouped by portal access roles
│   │   └── services/       # API configuration
├── server/                 # Express backend application
│   ├── config/             # DB and storage configurations
│   ├── controllers/        # Route controllers containing business logic
│   ├── middleware/         # authentication guards, role checks, and error handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   └── utils/              # Database seeders and utility modules
├── vercel.json             # Root-level Vercel deployment deployment setup
└── package.json            # Monorepo scripts
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas URI

### Installation

1. Clone the repository and navigate into the root directory:
   ```bash
   cd hospital-management
   ```

2. Install all dependencies for the workspace, client, and server:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Create a `.env` file in the `server` directory using `server/.env.example` as a template.
   - Create a `.env` file in the `client` directory and configure the API url along with your Supabase project credentials:
     ```env
     VITE_API_URL=http://localhost:5001/api
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Seed the database with mock clinics, users, doctors, and reviews:
   ```bash
   npm run seed
   ```

5. Launch both the Express server and the React dev client concurrently:
   ```bash
   npm run dev
   ```

The client will be running at `http://localhost:5173` and the backend server at `http://localhost:5001`.

---

## 🌐 Deployment on Vercel

The repository is configured for easy deployment on Vercel using the root-level [`vercel.json`](./vercel.json) settings.
Simply link the repository to your Vercel project and it will build and deploy the Vite frontend automatically.
