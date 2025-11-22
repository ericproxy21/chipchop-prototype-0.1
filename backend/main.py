from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, projects, git, collaboration

app = FastAPI(title="ChipChop Prototype 0.1 Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(git.router, prefix="/api/git", tags=["git"])
app.include_router(collaboration.router, prefix="/api/collab", tags=["collaboration"])

@app.get("/")
def read_root():
    return {"message": "Welcome to ChipChop Prototype 0.1 Backend"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
