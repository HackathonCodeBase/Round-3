<div align="center">

# 🏥 MediAssist — AI Response Suggestion System

**Empowering hospital staff with AI-drafted patient responses, reviewed and sent with confidence.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

[Features](#-features) • [Demo](#-screenshots) • [Quick Start](#-quick-start) • [API Docs](#-api-reference) • [Docker](#-docker-deployment) • [Architecture](#-architecture)

</div>

---

## 🌟 What is MediAssist?

MediAssist is a full-stack web application that helps **hospital staff respond to patient queries faster and more professionally** using AI-generated draft replies. Staff can review, edit, and approve AI suggestions before sending — ensuring quality, empathy, and medical safety in every response.

> **Built for TetherX Hackathon – Round 3**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Response Generation** | Powered by **Llama 3.3 70B** via Groq — ultra-fast inference |
| ✏️ **Human-in-the-Loop** | Staff review and edit every AI draft before it's sent |
| 📋 **Query Inbox** | View all incoming patient queries in a clean dashboard |
| 📜 **Query History** | Full audit trail of all sent responses with timestamps |
| 📊 **Live Dashboard** | Stats overview — total queries, pending, resolved |
| 🐳 **Docker Support** | One-command deployment with Docker Compose |
| 🔒 **Safety First** | AI is instructed never to give medical diagnoses |

---

## 🖥️ Screenshots

> Coming soon — run locally and see the dark-themed UI in action!

---

## 📁 Project Structure

```
Round-3/
├── backend/                    # FastAPI Python backend
│   ├── main.py                 # App entrypoint, CORS, router mounting
│   ├── database.py             # SQLAlchemy engine + session
│   ├── models.py               # Query ORM model
│   ├── gemini_service.py       # Groq AI integration (llama-3.3-70b)
│   ├── routes/
│   │   └── queries.py          # All API endpoints
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example            # Environment variable template
│
├── frontend/                   # Next.js 16 frontend
│   ├── app/
│   │   ├── dashboard/          # Stats overview page
│   │   ├── queries/            # Query inbox list
│   │   │   └── [id]/           # Response workspace (per query)
│   │   ├── history/            # Sent responses history
│   │   └── globals.css         # Dark theme design system
│   ├── components/
│   │   └── Sidebar.tsx         # Navigation sidebar
│   ├── services/
│   │   └── api.ts              # API client (typed)
│   └── Dockerfile
│
├── docker-compose.yml          # Full-stack deployment
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.12+**
- **Node.js 18+**
- **Groq API Key** (free at [console.groq.com](https://console.groq.com))

### 1. Clone the Repository

```bash
git clone https://github.com/HackathonCodeBase/Round-3.git
cd Round-3
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate          # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your Groq API key
```

**`.env` file:**
```env
GROQ_API_KEY="your_groq_api_key_here"
DATABASE_URL=sqlite:///./mediassist.db
```

```bash
# Start the backend
uvicorn main:app --reload
# API running at http://localhost:8000
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
# App running at http://localhost:3000
```

### 4. Open the App

Navigate to **[http://localhost:3000](http://localhost:3000)** — you'll be redirected to the Dashboard.

---

## 🔑 Getting a Groq API Key

1. Go to **[console.groq.com](https://console.groq.com)** and sign up (free, no credit card)
2. Navigate to **API Keys** → **Create API Key**
3. Copy the key (starts with `gsk_...`)
4. Paste it into `backend/.env` as `GROQ_API_KEY`

> **Free tier:** 14,400 requests/day with lightning-fast Llama 3.3 70B inference ⚡

---

## 📡 API Reference

Base URL: `http://localhost:8000`

Interactive docs: **[http://localhost:8000/docs](http://localhost:8000/docs)** (Swagger UI)

### Endpoints

<details>
<summary><b>GET /queries</b> — List all patient queries</summary>

```http
GET /queries
```

**Response:**
```json
[
  {
    "id": 1,
    "patient_name": "John Smith",
    "patient_query": "I have been experiencing severe headaches...",
    "status": "pending",
    "created_at": "2026-03-06T07:27:00",
    "ai_suggestion": null,
    "staff_response": null
  }
]
```
</details>

<details>
<summary><b>POST /generate-response</b> — Generate AI suggestion for a query</summary>

```http
POST /generate-response
Content-Type: application/json

{
  "query_id": 1
}
```

**Response:**
```json
{
  "query_id": 1,
  "ai_suggestion": "Thank you for reaching out. We understand you're experiencing severe headaches..."
}
```
</details>

<details>
<summary><b>POST /send-response</b> — Approve and send a response</summary>

```http
POST /send-response
Content-Type: application/json

{
  "query_id": 1,
  "response": "Thank you for reaching out. We recommend scheduling an appointment..."
}
```

**Response:**
```json
{
  "message": "Response sent successfully",
  "query_id": 1,
  "status": "resolved"
}
```
</details>

<details>
<summary><b>GET /stats</b> — Dashboard statistics</summary>

```http
GET /stats
```

**Response:**
```json
{
  "total": 10,
  "pending": 4,
  "resolved": 6
}
```
</details>

---

## 🐳 Docker Deployment

Run the entire stack with a single command:

```bash
# Make sure .env is configured first
cp backend/.env.example backend/.env
# Edit backend/.env with your GROQ_API_KEY

# Start everything
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |

```bash
# Stop everything
docker-compose down
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              Browser (Patient Staff)         │
└──────────────────┬──────────────────────────┘
                   │ HTTP
┌──────────────────▼──────────────────────────┐
│         Next.js 16 Frontend (Port 3000)      │
│  Dashboard | Query Inbox | History | Workspace│
└──────────────────┬──────────────────────────┘
                   │ REST API
┌──────────────────▼──────────────────────────┐
│         FastAPI Backend (Port 8000)          │
│   /queries  /generate-response  /stats       │
└──────┬───────────────────────────┬──────────┘
       │                           │
┌──────▼──────┐           ┌────────▼────────┐
│  SQLite DB  │           │   Groq API      │
│  (queries,  │           │ Llama 3.3 70B   │
│  responses) │           │  (AI drafts)    │
└─────────────┘           └─────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, TypeScript, Vanilla CSS |
| **Backend** | FastAPI, Python 3.12, Uvicorn |
| **AI Model** | Llama 3.3 70B (via Groq API) |
| **Database** | SQLite + SQLAlchemy ORM |
| **Deployment** | Docker + Docker Compose |

---

## 🤝 Team

Built with ❤️ for **VIT TetherX Hackathon – Round 3**

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).