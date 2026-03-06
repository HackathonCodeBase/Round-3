# MediAssist – AI Response Suggestion System for Hospitals

A full-stack application that helps hospital staff draft professional responses to patient queries using Google Gemini AI.

> **AI only suggests responses — staff always review, edit, and approve before sending.**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4 |
| Backend | Python, FastAPI |
| AI | Google Gemini 1.5 Flash |
| Database | SQLite (via SQLAlchemy) |

---

## Quick Start

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env
echo "DATABASE_URL=sqlite:///./mediassist.db" >> .env

uvicorn main:app --reload --port 8000
```

API docs at: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm install framer-motion lucide-react
npm run dev
```

App at: http://localhost:3000

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/query` | Submit patient query |
| POST | `/generate-response` | Generate AI suggestion via Gemini |
| POST | `/send-response` | Approve & send edited response |
| GET | `/queries` | List all queries |
| GET | `/history` | Resolved queries with responses |
| GET | `/stats` | Dashboard statistics |

---

## Docker (Optional)

```bash
# Add your Gemini API key to backend/.env first
docker-compose up --build
```

---

## Workflow

1. Staff submit a patient query via the dashboard
2. System stores it and sends it to Gemini API
3. Gemini generates a professional draft response
4. Staff review and edit the draft
5. Staff click **Approve & Send** — response is stored
6. Full history logged: original query, AI suggestion, final response