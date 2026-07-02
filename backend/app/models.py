from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from .database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(100), nullable=False)
    desc = Column(String(255))
    img = Column(String(255))
    category = Column(String(50)) # frontend or backend
    tags = Column(String(100)) # e.g. "Web, App"
    frontendText = Column(Text)
    frontendTech = Column(String(100))
    backendText = Column(Text)
    backendApi = Column(String(100))
    backendDb = Column(String(100))

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(50))
    company = Column(String(100))
    projectType = Column(String(50))
    description = Column(Text)
    budget = Column(String(50))
    reference = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
