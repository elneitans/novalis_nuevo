# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base

from .routers import auth, projects, llama  # Lo crearemos más adelante

Base.metadata.create_all(bind=engine)

app = FastAPI()
origins = ["*"]  # o las URLs que quieras permitir

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "¡Bienvenido a Novalis.ai!"}

# Incluir las rutas de los routers
app.include_router(auth.router)
app.include_router(projects.router)
