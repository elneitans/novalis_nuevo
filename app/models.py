from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    # Puedes añadir más campos como nombre, fecha de creación, etc.

    projects = relationship("Project", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    updated_at = Column("updated_at", DateTime,
                       default=datetime.now(timezone.utc),
                       onupdate=datetime.now(timezone.utc),
                       server_default=text("now()"))

    owner = relationship("User", back_populates="projects")
