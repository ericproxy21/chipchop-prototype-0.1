from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: str
    username: str
    token: str

# Mock database
users_db = {}

@router.post("/login", response_model=User)
async def login(request: LoginRequest):
    # Simple mock auth - accept any non-empty username/password
    if not request.username or not request.password:
        raise HTTPException(status_code=400, detail="Username and password required")
    
    # Generate a mock token
    token = str(uuid.uuid4())
    user = User(id=str(uuid.uuid4()), username=request.username, token=token)
    
    # Store active session (mock)
    users_db[token] = user
    
    return user

@router.get("/me", response_model=User)
async def get_current_user(token: str):
    if token not in users_db:
        raise HTTPException(status_code=401, detail="Invalid token")
    return users_db[token]
