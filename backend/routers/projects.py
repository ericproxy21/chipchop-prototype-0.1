from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import os
import shutil
import json
from datetime import datetime

router = APIRouter()

PROJECTS_DIR = "projects_data"

# Ensure projects directory exists
if not os.path.exists(PROJECTS_DIR):
    os.makedirs(PROJECTS_DIR)

class Project(BaseModel):
    id: str
    name: str
    description: str = ""
    path: str
    created_at: str
    last_modified: str

class CreateProjectRequest(BaseModel):
    name: str
    description: str = ""

@router.get("/", response_model=List[Project])
async def list_projects():
    projects = []
    if not os.path.exists(PROJECTS_DIR):
        return []
        
    for project_name in os.listdir(PROJECTS_DIR):
        project_path = os.path.join(PROJECTS_DIR, project_name)
        if os.path.isdir(project_path):
            stats = os.stat(project_path)
            
            # Try to read metadata file
            metadata_path = os.path.join(project_path, "metadata.json")
            description = ""
            if os.path.exists(metadata_path):
                try:
                    with open(metadata_path, 'r') as f:
                        metadata = json.load(f)
                        description = metadata.get('description', '')
                except Exception:
                    pass  # If metadata file is corrupted, use empty description
            
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import os
import shutil
import json
from datetime import datetime

router = APIRouter()

PROJECTS_DIR = "projects_data"

# Ensure projects directory exists
if not os.path.exists(PROJECTS_DIR):
    os.makedirs(PROJECTS_DIR)

class Project(BaseModel):
    id: str
    name: str
    description: str = ""
    path: str
    created_at: str
    last_modified: str

class CreateProjectRequest(BaseModel):
    name: str
    description: str = ""
    architecture_content: str = None
    microarchitecture_content: str = None
    rtl_content: str = None

@router.get("/", response_model=List[Project])
async def list_projects():
    projects = []
    if not os.path.exists(PROJECTS_DIR):
        return []
        
    for project_name in os.listdir(PROJECTS_DIR):
        project_path = os.path.join(PROJECTS_DIR, project_name)
        if os.path.isdir(project_path):
            stats = os.stat(project_path)
            
            # Try to read metadata file
            metadata_path = os.path.join(project_path, "metadata.json")
            description = ""
            if os.path.exists(metadata_path):
                try:
                    with open(metadata_path, 'r') as f:
                        metadata = json.load(f)
                        description = metadata.get('description', '')
                except Exception:
                    pass  # If metadata file is corrupted, use empty description
            
            projects.append(Project(
                id=project_name,
                name=project_name,
                description=description,
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
        
        # Create metadata file
        metadata = {
            'name': request.name,
            'description': request.description,
            'created_at': datetime.now().isoformat()
        }
        metadata_path = os.path.join(project_path, "metadata.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        # Create project files
        # 1. RTL - Create rtl directory and gcd_accelerator.v file
        rtl_dir = os.path.join(project_path, "rtl")
        os.makedirs(rtl_dir, exist_ok=True)
        
        rtl_content = request.rtl_content
        if not rtl_content:
            rtl_content = f"// Project: {request.name}\n// Created: {datetime.now()}\n"
        
        with open(os.path.join(rtl_dir, "gcd_accelerator.v"), "w") as f:
            f.write(rtl_content)

        # 2. Architecture
        if request.architecture_content:
            with open(os.path.join(project_path, "architecture.md"), "w") as f:
                f.write(request.architecture_content)

        # 3. Microarchitecture
        if request.microarchitecture_content:
            with open(os.path.join(project_path, "microarchitecture.json"), "w") as f:
                f.write(request.microarchitecture_content)
            
        stats = os.stat(project_path)
        return Project(
            id=request.name,
            name=request.name,
            description=request.description,
            path=os.path.abspath(project_path),
            created_at=datetime.fromtimestamp(stats.st_ctime).isoformat(),
            last_modified=datetime.fromtimestamp(stats.st_mtime).isoformat()
        )
    except Exception as e:
        # Cleanup if failed
        if os.path.exists(project_path):
            shutil.rmtree(project_path)
        raise HTTPException(status_code=500, detail=str(e))

class FileUpdate(BaseModel):
    content: str

@router.get("/{project_id}/files/{filename}")
async def get_project_file(project_id: str, filename: str):
    project_path = os.path.join(PROJECTS_DIR, project_id)
    file_path = os.path.join(project_path, filename)
    
    if not os.path.exists(project_path):
        raise HTTPException(status_code=404, detail="Project not found")
        
    if not os.path.exists(file_path):
        # Return empty content for non-existent files instead of 404
        # This allows editors to start empty if file doesn't exist yet
        return {"content": ""}
        
    try:
        with open(file_path, "r") as f:
            content = f.read()
        return {"content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{project_id}/files/{filename}")
async def update_project_file(project_id: str, filename: str, update: FileUpdate):
    project_path = os.path.join(PROJECTS_DIR, project_id)
    file_path = os.path.join(project_path, filename)
    
    if not os.path.exists(project_path):
        raise HTTPException(status_code=404, detail="Project not found")
        
    try:
        with open(file_path, "w") as f:
            f.write(update.content)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
