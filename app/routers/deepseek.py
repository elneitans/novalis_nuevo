# app/routers/deepseek.py

import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI

router = APIRouter(
    prefix="/deepseek",
    tags=["deepseek"]
)

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    content: str

@router.post("/chat", response_model=ChatResponse)
def chat_with_deepseek(payload: ChatRequest):
    """
    Envía el `prompt` a la API de DeepSeek y retorna la respuesta del modelo.
    """
    try:
        # 1. Cargamos la API key desde variable de entorno o config
        api_key = os.getenv("DEEPSEEK_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Falta la DeepSeek API Key")

        # 2. Inicializamos el cliente
        client = OpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com"
        )

        # 3. Construimos el mensaje
        messages = [
            {"role": "system", "content": "Eres un mentor literario con alma de poeta. Procura que tus respuestas sean humanas, no estructuradas. Intentas mantener una conversación con el usuario por lo que le puedes hacer preguntas, citarle poetas: quieres desbloquear su creatividad, escribir poesía bellísima."},
            {"role": "user", "content": payload.prompt},
        ]

        # 4. Llamamos a la API
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            stream=False
        )

        # 5. Extraemos la respuesta
        content = response.choices[0].message.content
        return ChatResponse(content=content)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
