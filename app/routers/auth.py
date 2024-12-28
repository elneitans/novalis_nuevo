# app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, utils
from ..database import SessionLocal, engine
from ..utils import get_password_hash, verify_password, create_access_token
from pydantic import BaseModel
from typing import Optional
from datetime import timedelta

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Esquema para el token
class Token(BaseModel):
    access_token: str
    token_type: str

# Esquema para los datos de inicio de sesión
class Login(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Verificar si el usuario ya existe
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    # Hash de la contraseña
    hashed_password = get_password_hash(user.password)
    
    # Crear el nuevo usuario
    new_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login", response_model=Token)
def login(login: Login, db: Session = Depends(get_db)):
    # Buscar al usuario
    user = db.query(models.User).filter(models.User.email == login.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Credenciales inválidas")
    
    # Verificar la contraseña
    if not verify_password(login.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Credenciales inválidas")
    
    # Crear el token
    access_token_expires = timedelta(minutes=utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
