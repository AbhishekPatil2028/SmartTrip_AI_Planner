# 🌍 SmartTrip AI Planner

An AI-powered travel planning web application that automatically generates personalized day-by-day itineraries from your uploaded booking documents.

![SmartTrip AI Planner](./samples/sample_flight_ticket.png)

---

## 🚀 Features

### Core Features
- ✅ **JWT Authentication** — Secure login/register with token persistence
- ✅ **Document Upload** — Upload flight tickets, hotel bookings, PDFs, and images
- ✅ **AI Data Extraction** — Powered by **Google Gemini 2.5 Flash** to parse booking info
- ✅ **AI Itinerary Generation** — Auto-generates a full day-by-day travel roadmap
- ✅ **Itinerary History** — Dashboard to browse and manage all saved trips
- ✅ **Sharing** — Public shareable link with UUID + "Clone to Dashboard" button
- ✅ **Responsive UI** — Premium React frontend with dark theme and glassmorphism

### Bonus Features
- ✅ **AWS S3 Integration** — Booking documents backed up to S3 cloud storage
- ✅ **Drag-and-Drop** — Smooth drag-and-drop file uploader
- ✅ **ICS Calendar Export** — Export trip to Google/Apple/Outlook Calendar
- ✅ **Print to PDF** — Clean print media queries for PDF output
- ✅ **Interactive Packing Checklist** — AI-generated, checkable packing list
- ✅ **Travel Tips** — AI-powered local tips for every destination

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite), React Router, Lucide Icons |
| Backend | Node.js, Express.js (ES Modules) |
| Database | MongoDB (Mongoose ODM) |
| AI Engine | Google Gemini 2.5 Flash API |
| File Storage | AWS S3 (ap-south-1) |
| Auth | JWT (JSON Web Tokens) + bcryptjs |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API Key (free from [Google AI Studio](https://aistudio.google.com/))
- AWS S3 credentials (optional — app works without it)

### 1. Clone the Repository
```bash
git clone https://github.com/AbhishekPatil2028/SmartTrip_AI_Planner.git
cd SmartTrip_AI_Planner
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/smarttrip_ai_planner
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: AWS S3 (skip if not using cloud storage)
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your_bucket_name
```

Start the backend:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in Browser
Visit `http://localhost:5173`

---

## 🔑 API Key Configuration (Important!)

The app supports **dynamic API key switching** via the UI:
- If you hit a `429 Quota Exceeded` error, click the **⚙️ Settings** (cog icon) in the navbar
- Paste a new free Gemini API key from [Google AI Studio](https://aistudio.google.com/)
- The app instantly uses the new key — no restart required!

---

## 📁 Folder Structure

```
SmartTrip_AI_Planner/
├── backend/
│   ├── config/          # DB + S3 configuration
│   ├── controllers/     # Route controllers (auth, upload, itinerary)
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # Mongoose schemas (User, Itinerary)
│   ├── routes/          # Express route definitions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components (Navbar, BookingCard, Timeline...)
│   │   ├── context/     # Auth context + API key management
│   │   ├── pages/       # Route pages (Landing, Login, Dashboard, Planner, Itinerary)
│   │   └── App.jsx      # Router setup
│   └── index.html
└── samples/             # Sample test files (flight ticket, hotel booking)
```

---

## 📸 Sample Test Files

The `samples/` folder contains ready-to-use test documents:
- `sample_flight_ticket.png` — Air France AF023, JFK→CDG
- `sample_hotel_booking.png` — Ritz Paris, Jun 15–22 2026

---

## 📄 License
MIT License — Free to use and modify.