from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import os
import shutil
from datetime import datetime

router = APIRouter()

PROJECTS_DIR = "projects_data"

# Ensure projects directory exists
if not os.path.exists(PROJECTS_DIR):
    os.makedirs(PROJECTS_DIR)

class Project(BaseModel):
    id: str
    name: str
    path: str
    created_at: str
    last_modified: str

class CreateProjectRequest(BaseModel):
    name: str

@router.get("/", response_model=List[Project])
async def list_projects():
    projects = []
    if not os.path.exists(PROJECTS_DIR):
        return []
        
    for project_name in os.listdir(PROJECTS_DIR):
        project_path = os.path.join(PROJECTS_DIR, project_name)
        if os.path.isdir(project_path):
            stats = os.stat(project_path)
            projects.append(Project(
                id=project_name, # Simple ID for now
                name=project_name,
                path=os.path.abspath(project_path),
                created_at=datetime.fromtimestamp(stats.st_ctime).isoformat(),
                last_modified=datetime.fromtimestamp(stats.st_mtime).isoformat()
            ))
    return projects

@router.post("/", response_model=Project)
async def create_project(request: CreateProjectRequest):
    project_path = os.path.join(PROJECTS_DIR, request.name)
    
    if os.path.exists(project_path):
        raise HTTPException(status_code=400, detail="Project already exists")
    
    try:
        os.makedirs(project_path)
        # Create a dummy project file
        with open(os.path.join(project_path, "project.v"), "w") as f:
            f.write(f"// Project: {request.name}\n// Created: {datetime.now()}\n")
            
        stats = os.stat(project_path)
        return Project(
            id=request.name,
            name=request.name,
            path=os.path.abspath(project_path),
            created_at=datetime.fromtimestamp(stats.st_ctime).isoformat(),
            last_modified=datetime.fromtimestamp(stats.st_mtime).isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
