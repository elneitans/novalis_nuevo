# app/schemas.py

from pydantic import BaseModel, EmailStr
from typing import List, Optional

class ProjectBase(BaseModel):
    title: str
    content: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    projects: List[Project] = []

    class Config:
        orm_mode = True
