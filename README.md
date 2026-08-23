# 🎓 CampusCare - Smart Complaint Management System

> **AI-Powered, Hackathon-Ready Campus Grievance Resolution Platform**  
> *"Report Problems. We Make Sure They're Solved."*

---
## Problem 
   Campus complaints are often managed through fragmented channels such as emails, forms, messaging groups, or manual registers. This makes it difficult to prioritize emergencies, identify duplicate complaints, assign issues to the right department, track resolution progress, and measure staff performance.
   
## Solution
   **CampusCare** centralizes the entire grievance lifecycle using AI-powered triage, duplicate detection, automated routing, real-time tracking, geolocation, and analytics.
---
## 🌟 Executive Overview

**CampusCare** is a full-stack, AI-powered campus grievance platform designed for universities and educational institutions. Powered by **Google Gemini AI** and **Cosine Similarity duplicate detection algorithms**, the platform automates ticket triage, emergency priority detection, department routing, staff workload dispatching, SLA resolution tracking, and real-time spatial campus mapping.

---

## ✨ Core Features

- 🤖 **Google Gemini AI Automated Triage**: Analyzes complaint title, description, and location to automatically assign category tags, determine urgency priority (`Critical`, `High`, `Medium`, `Low`), route tickets to department queues (`Maintenance`, `Electrical`, `IT`, `Sanitation`, `Security`, `Hostel`, etc.), and generate executive summaries.
- 🔍 **Intelligent Duplicate Detection System**: TF-IDF & Cosine similarity algorithms calculate text similarity in real time, alerting students to existing tickets (e.g. Block A water cooler issues) with match confidence ratings before submission.
- 🔐 **Role-Based Authentication & Guard System (RBAC)**:
  - **Student**: File complaints with live image upload & GPS geolocation capture, view 5-stage progress timeline (`Submitted` ➔ `AI Analyzed` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved`), view technician resolution notes & completion photos.
  - **Staff**: Dedicated workload workspace, state transition controls (`Start Work` ➔ `Resolve`), mandatory resolution note enforcement, and completion photo evidence uploads.
  - **Admin Workspace**: Comprehensive management dashboard, 5 Recharts visualizations, staff assignment modal, duplicate linking modal, and date-filtered MongoDB analytics.
- 📸 **Multer Image Upload System**: Student incident photo upload & staff repair completion evidence with live frontend previews, strict MIME type filtering (`.jpg`, `.png`, `.webp`, `.gif`), and 5MB size limits.
- 🗺️ **Campus Incident Spatial Map**: Interactive campus map displaying priority-coded markers (🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low) with popup details and a fallback SVG blueprint view.
- 📊 **Real-Time Analytics Engine**: Date range filters (`7 days`, `30 days`, `90 days`, `All time`), SLA turnaround calculations, and 9-department operational performance matrices.

---

## 🛠️ Technology Stack

### Frontend
- **Core**: React 18 + Vite
- **Styling**: Vanilla CSS Design Tokens + Tailwind CSS
- **Routing**: React Router v6 (Protected Role Guards)
- **Data Visualizations**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose ORM
- **AI Integration**: `@google/generative-ai` (Gemini API with deterministic fallback)
- **Security & Authentication**: JSON Web Tokens (JWT) + bcryptjs (10 salt rounds)
- **File Uploads**: Multer (Static file serving)

---

## 📂 Project Directory Structure

```
smart-complaint-management/
├── client/                           # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/               # Reusable SaaS UI Components
│   │   │   ├── AIBadge.jsx           # AI visual badges (🤖 AI Analyzed, ⚡ Priority, 🔍 Duplicate)
│   │   │   ├── AIAnalysisCard.jsx    # Gemini AI classification breakdown card
│   │   │   ├── AdminComplaintsTable.jsx # Multi-filtered executive complaints table
│   │   │   ├── AssignStaffModal.jsx  # Staff assignment modal
│   │   │   ├── ComplaintCard.jsx     # Student dashboard complaint card
│   │   │   ├── ComplaintTimeline.jsx # 5-Stage visual progress status timeline
│   │   │   ├── DashboardCard.jsx     # Stat KPI metric card
│   │   │   ├── DuplicateBadge.jsx    # Duplicate similarity badge
│   │   │   ├── DuplicateWarningModal.jsx # Duplicate detection modal
│   │   │   ├── EmptyState.jsx        # Empty state component
│   │   │   ├── LoadingSpinner.jsx    # Loading animation component
│   │   │   ├── MarkDuplicateModal.jsx # Admin duplicate linking modal
│   │   │   ├── Modal.jsx             # Reusable modal container
│   │   │   ├── Navbar.jsx            # Responsive header with mobile drawer
│   │   │   ├── PriorityBadge.jsx     # Priority tag badge
│   │   │   ├── StaffResolveModal.jsx # Mandatory resolution note & photo modal
│   │   │   ├── StatusBadge.jsx       # Status tag badge
│   │   │   └── Toast.jsx             # Notification toast alerts
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # JWT authentication & session context
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx    # Admin workspace & Recharts metrics
│   │   │   ├── AdminComplaints.jsx   # Admin complaints directory
│   │   │   ├── Analytics.jsx         # SaaS Analytics Dashboard with date filters
│   │   │   ├── ComplaintDetails.jsx  # Student tracking & resolution details box
│   │   │   ├── LandingPage.jsx       # Landing page
│   │   │   ├── Login.jsx             # Sign in form
│   │   │   ├── Map.jsx               # Campus incident spatial map page
│   │   │   ├── MyComplaints.jsx      # Student's complaints queue
│   │   │   ├── Register.jsx          # Student registration form
│   │   │   ├── StaffDashboard.jsx    # Staff technician workload portal
│   │   │   ├── StudentDashboard.jsx  # Student grievance workspace
│   │   │   └── SubmitComplaint.jsx   # Complaint submission form with GPS & Multer preview
│   │   ├── services/
│   │   │   └── api.js                # Axios API service client
│   │   ├── App.jsx                   # React Router entrypoint & Protected Route Guards
│   │   └── index.css                 # Global CSS design tokens & animations
│   ├── package.json
│   └── vite.config.js
├── server/                           # Express Backend Application
│   ├── config/
│   │   ├── db.js                     # MongoDB connection & fallback setup
│   │   └── autoSeed.js               # Auto-seeding database handler
│   ├── middleware/
│   │   ├── auth.js                   # JWT protection & role authorization
│   │   ├── errorHandler.js           # Centralized error handler
│   │   └── upload.js                 # Multer image upload & MIME filter middleware
│   ├── models/
│   │   ├── User.js                   # User Mongoose schema (bcrypt pre-save hook)
│   │   └── Complaint.js              # Complaint Mongoose schema
│   ├── routes/
│   │   ├── ai.js                     # AI analysis & duplicate check routes
│   │   ├── analytics.js              # Aggregation pipeline analytics routes
│   │   ├── auth.js                   # Login, register, & profile routes
│   │   ├── complaints.js             # Complaint CRUD, assign, & resolve routes
│   │   ├── health.js                 # Server health check route
│   │   └── users.js                  # Staff and user query routes
│   ├── services/
│   │   ├── aiService.js              # Gemini API integration service
│   │   └── duplicateDetector.js      # TF-IDF Cosine Similarity duplicate service
│   ├── uploads/                      # Static image upload storage
│   ├── seed.js                       # Seeder script (36 users & 52 complaints)
│   ├── server.js                     # Express app initialization
│   └── package.json
├── .env.example
├── package.json                      # Root workspace scripts
└── README.md
```

---

## 🔑 Demo Account Credentials

> All user passwords in MongoDB are securely encrypted using **bcrypt** (10 salt rounds).

| Role | User Name | Email Address | Password | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | System Admin | `admin@college.edu` | `password123` | Full Campus Directory, Assignment, Duplicate Linking, Analytics |
| **Staff** | Vikram Singh | `facilities.staff@college.edu` | `password123` | Facilities & Maintenance Technician Queue |
| **Staff** | Anita Rao | `electrical.staff@college.edu` | `password123` | Electrical Department Technician Queue |
| **Staff** | Rajesh Kumar | `it.staff@college.edu` | `password123` | IT & Network Technician Queue |
| **Staff** | Sanjay Dutt | `sanitation.staff@college.edu` | `password123` | Sanitation Department Queue |
| **Staff** | Priya Sharma | `security.staff@college.edu` | `password123` | Security Department Queue |
| **Student** | Student User 1 | `student1@college.edu` | `password123` | Student Dashboard & Complaint Filing |
| **Student** | Student User 2..30 | `student2@college.edu` ... `student30@college.edu` | `password123` | Student Dashboard & Complaint Filing |

---

## ⚙️ Environment Configuration (`.env.example`)

Create `.env` file in root or server directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart_complaint_db
JWT_SECRET=JWT_SECRET_HERE 
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

---

## 🚀 Installation & Run Guide

```bash
# 1. Install root dependencies
npm install

# 2. Install server dependencies
cd server && npm install

# 3. Install client dependencies
cd ../client && npm install

# 4. Seed Database with 36 Users & 52 Complaints
cd ../server
npm run seed

# 5. Run Backend & Frontend Concurrently (Root Directory)
cd ..
npm run dev
```

---

## 🤖 AI & Map Configuration

- **AI Configuration**: Set `GEMINI_API_KEY` in `.env`. If key is not provided, system executes a deterministic keyword classifier & TF-IDF Cosine Similarity algorithm so all AI features work 100% offline.
- **Map Configuration**: Spatial map renders coordinates (`latitude`, `longitude`). If Google Maps or Mapbox keys are absent, an interactive SVG Campus Blueprint View automatically renders.

---

## ⏱️ 3-Minute Hackathon Demo Script

Follow this step-by-step walkthrough during judge presentations:

1. **Student Complaint Filing (0:00 - 0:45)**
   - Sign in as `student1@college.edu` / `password123`.
   - Click **File New Complaint**.
   - Enter Title: *"Water cooler in Block A has stopped working."*
   - Click **Use My Location** (GPS pins coordinates).
   - Watch **Gemini AI Card** automatically classify category (`Water Supply`), detect urgency (`High`), and route ticket to `Maintenance`.
   - Drag & drop incident photo (live image preview renders). Click **Submit Complaint**.

2. **Duplicate Detection Modal (0:45 - 1:15)**
   - Notice **⚠️ Possible Duplicate Complaint** warning modal flagging `#CMP-1042` (94% similarity rating). Click **Link to Existing Ticket**.

3. **Admin Assignment & Triage (1:15 - 1:45)**
   - Sign in as Admin (`admin@college.edu` / `password123`).
   - Open **Admin Workspace**. View 5 Recharts visualizations and dynamic KPI cards.
   - Go to **All Complaints Table**. Click **Assign** icon on `#CMP-1042` -> select technician `Vikram Singh` -> click **Assign Staff**.

4. **Staff Workload & Resolution (1:45 - 2:30)**
   - Sign in as Technician `facilities.staff@college.edu` / `password123`.
   - View **My Assigned Queue**. Click **Start Work** (Status updates to `In Progress`).
   - Click **Resolve** -> enter mandatory Resolution Note (*"Replaced worn out valve and tested water pressure"*), attach completion photo, click **Complete & Mark Resolved**.

5. **Student Tracking & Analytics (2:30 - 3:00)**
   - Sign in back as Student -> open Ticket `#CMP-1042`.
   - Observe **5-Stage Timeline** (Stage 5 `Resolved` completed) and green **✓ Complaint Resolved** box displaying Resolution Note, Photo, Technician Name, & calculated Resolution Duration (`28 mins`).
   - Navigate to **Analytics Dashboard** to demonstrate date range filters (`7d`, `30d`, `90d`, `all`) and Department Performance matrix.
