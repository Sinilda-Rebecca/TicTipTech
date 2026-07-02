from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

from .database import get_db, engine, Base
from . import models

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
def create_submission(submission: SubmissionCreateSchema, db: Session = Depends(get_db)):
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
    return {"status": "success", "id": db_submission.id}
