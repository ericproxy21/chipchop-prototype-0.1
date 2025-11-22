from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from git import Repo, GitCommandError

router = APIRouter()

PROJECTS_DIR = "projects_data"

class GitStatus(BaseModel):
    branch: str
    changed_files: List[str]
    is_clean: bool

class CommitRequest(BaseModel):
    message: str

@router.get("/{project_id}/status", response_model=GitStatus)
async def get_git_status(project_id: str):
    project_path = os.path.join(PROJECTS_DIR, project_id)
    if not os.path.exists(project_path):
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        repo = Repo(project_path)
        return GitStatus(
            branch=repo.active_branch.name,
            changed_files=[item.a_path for item in repo.index.diff(None)] + repo.untracked_files,
            is_clean=not repo.is_dirty(untracked_files=True)
        )
    except Exception:
        # If not a git repo, initialize it? Or just return empty/error?
        # For now, let's assume we might need to init
        return GitStatus(branch="none", changed_files=[], is_clean=True)

@router.post("/{project_id}/init")
async def init_git(project_id: str):
    project_path = os.path.join(PROJECTS_DIR, project_id)
    if not os.path.exists(project_path):
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        Repo.init(project_path)
        return {"message": "Git repository initialized"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{project_id}/commit")
async def commit_changes(project_id: str, request: CommitRequest):
    project_path = os.path.join(PROJECTS_DIR, project_id)
    try:
        repo = Repo(project_path)
        repo.git.add(A=True)
        repo.index.commit(request.message)
        return {"message": "Changes committed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
