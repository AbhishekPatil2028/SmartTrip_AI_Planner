# SmartTrip AI — Premium MERN Travel Planner

SmartTrip AI is a state-of-the-art web application that automatically translates travel booking documents (PDF tickets, hotel receipts, flight confirmations, and train tickets) into a gorgeous day-by-day vacation roadmap.

---

## 🌟 Key Features

1. **AI-Powered OCR and Data Extraction:**
   - Drag and drop PDF or image tickets (PNG/JPG) directly into the planner console.
   - Extracts departure/arrival locations, dates, check-in times, and reservation confirmation numbers using **Gemini 1.5 Flash**.

2. **Daily Timeline Synthesis:**
   - Seamlessly integrates extracted check-ins and flights on the correct dates and times.
   - Organizes each day into Morning, Afternoon, and Evening activities, enriched with sightseeing destinations and dining spots.

3. **Product-Oriented Exporters (Client-Side):**
   - 📅 **ICS Calendar Sync:** Synthesizes and exports standard `.ics` calendar events. One-click import into Google Calendar, Outlook, or Apple Calendar!
   - 🖨️ **Print-to-PDF Formatting:** Custom CSS print styles that hide buttons and dashboard panels, allowing you to save beautiful physical PDF brochures.

4. **Public Itinerary Sharing and Cloning:**
   - Toggle an itinerary to "Shared" to generate an obfuscated public share link.
   - Friends can view your timeline in a stunning, read-only dashboard.
   - 📂 **Cloning Pipeline:** Any registered visitor can click "Save to Dashboard" to copy the public itinerary directly into their personal account to customize it!

5. **Dynamic API Key Drawer:**
   - A secure settings panel in the navigation bar allows users to save their own `GEMINI_API_KEY` securely in browser storage (`localStorage`), bypassing backend variables if needed.

---

## 🛠️ Technical Stack

- **Frontend:** React.js, Vite, React Router, Lucide Icons, Custom Glassmorphism CSS Framework
- **Backend:** Node.js, Express.js, Multer (In-Memory buffer processing)
- **Database:** MongoDB, Mongoose ORM
- **AI Core:** Official Google Gen AI SDK (`@google/generative-ai` + Gemini 1.5 Flash)
- **Security:** JWT (JSON Web Tokens) Authorization Bearer headers, bcryptjs password hashing

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on the default port `27017`

### 1. Setup Backend Environment Variables
Create a file at `backend/.env` (a template is already provided) and configure the following parameters:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/smarttrip_ai_planner
JWT_SECRET=super_secret_key_for_smarttrip_ai_planner_123!

# OPTIONAL: Configure your key here, or supply it in the frontend settings panel.
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Run the Applications

#### Start the Backend API Server:
```bash
cd backend
npm run dev # or npm start
```
The backend API server will run at `http://localhost:3000`.

#### Start the React Frontend Server:
```bash
cd frontend
npm run dev
```
The React development server will start at `http://localhost:5173`. Open this URL in your web browser!

---

## 🔒 Security & Privacy Note
Your passwords are fully hashed using **bcryptjs** in the database. When uploading travel tickets, the files are processed directly in-memory and sent straight to Gemini APIs via HTTPS — no documents are stored permanently on our server, preserving complete digital privacy.


// for Tester 

"The application is configured with a default backend Gemini key. If you experience a 429 Quota Exceeded error due to concurrent testers, please click the Settings (cog) icon in the top-right navbar to easily save your own free Gemini API Key from Google AI Studio to resume testing instantly!"