import os
# Custom .env loader to load configuration before importing submodules
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
if os.path.exists(env_path):
    with open(env_path, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ[key.strip()] = val.strip().strip('"').strip("'")

from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

from .database import get_db, engine, Base
from . import models
from .email_service import send_email_notifications

# Auto-create tables on startup (if not exists)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TicTip Tech API", version="1.0.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schemas
class ProjectSchema(BaseModel):
    id: int
    key: str
    title: str
    desc: Optional[str]
    img: Optional[str]
    category: Optional[str]
    tags: Optional[str]
    frontendText: Optional[str]
    frontendTech: Optional[str]
    backendText: Optional[str]
    backendApi: Optional[str]
    backendDb: Optional[str]

    class Config:
        orm_mode = True

class SubmissionCreateSchema(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    company: Optional[str] = ""
    projectType: Optional[str] = ""
    description: Optional[str] = ""
    budget: Optional[str] = ""
    reference: Optional[str] = ""

class SubmissionSchema(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    company: Optional[str]
    projectType: Optional[str]
    description: Optional[str]
    budget: Optional[str]
    reference: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True

@app.get("/api/projects", response_model=List[ProjectSchema])
def read_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@app.get("/api/projects/{key}", response_model=ProjectSchema)
def read_project(key: str, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.key == key).first()
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@app.post("/api/contact")
def create_submission(submission: SubmissionCreateSchema, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_submission = models.Submission(
        name=submission.name,
        email=submission.email,
        phone=submission.phone,
        company=submission.company,
        projectType=submission.projectType,
        description=submission.description,
        budget=submission.budget,
        reference=submission.reference
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    
    # Send thank you and lead notification emails in the background
    background_tasks.add_task(
        send_email_notifications,
        name=submission.name,
        email=submission.email,
        project_type=submission.projectType,
        budget=submission.budget,
        description=submission.description,
        phone=submission.phone,
        company=submission.company
    )

    return {"status": "success", "id": db_submission.id}

