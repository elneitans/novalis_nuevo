# create_tables.py

from app.database import engine  # Asegúrate de que la ruta sea correcta según tu estructura de proyecto
from app.models import Base   # Asegúrate de que Base esté importado de tu archivo de modelos

# Crea todas las tablas definidas en los modelos
Base.metadata.create_all(bind=engine)

print("Tablas creadas correctamente.")
