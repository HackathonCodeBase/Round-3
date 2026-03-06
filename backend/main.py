from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_tables
from routes.queries import router

app = FastAPI(
    title="MediAssist API",
    description="AI Response Suggestion System for Hospitals",
    version="1.0.0"
)

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables on startup
create_tables()

# Register routes
app.include_router(router)


@app.get("/")
def root():
    return {"message": "MediAssist API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "healthy"}
