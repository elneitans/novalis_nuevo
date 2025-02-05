# app/routers/projects.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from .. import models, schemas
from ..database import SessionLocal
from ..utils import get_current_user

router = APIRouter(
    prefix="/projects",
    tags=["projects"]
)

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Project)
def create_project(
    project_create: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Crea un nuevo proyecto para el usuario autenticado.
    """
    new_project = models.Project(
        title=project_create.title,
        content=project_create.content,
        owner_id=current_user.id,
        updated_at=datetime.now(timezone.utc)
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/", response_model=list[schemas.Project])
def read_projects(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retorna todos los proyectos del usuario actual.
    """
    projects = db.query(models.Project)\
                 .filter(models.Project.owner_id == current_user.id).all()
    return projects

@router.get("/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.owner_id == current_user.id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return project

@router.get("/")
def read_projects(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Retorna todos los proyectos asociados al usuario actual."""
    projects = db.query(models.Project).filter(models.Project.owner_id == current_user.id).all()
    return projects

@router.put("/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project_update: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.owner_id == current_user.id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    project.title = project_update.title
    project.content = project_update.content
    db.commit()
    db.refresh(project)
    return project

@router.get("/{project_id}", response_model=schemas.Project)
def read_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Retorna un proyecto específico del usuario actual por ID.
    """
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.owner_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return project

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.owner_id == current_user.id).first()
    if project is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    db.delete(project)
    db.commit()
    return {"detail": "Proyecto eliminado"}
