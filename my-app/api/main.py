import mysql.connector
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class User(BaseModel):
    firstName: str
    lastName: str
    email: str
    birth: str = None
    postalCode: str = None
    ville: str = None

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "db"),
        database=os.getenv("MYSQL_DATABASE", "ynov_ci"),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD", "ynovpwd"),
        port=3306
    )

@app.get("/users")
async def get_users():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    records = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"users": [dict(row) for row in records]}

@app.post("/users")
async def create_user(user: User):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email=%s", (user.email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Email déjà pris")

    cursor.execute(
        "INSERT INTO users (firstName, lastName, email, birth, postalCode, ville) VALUES (%s, %s, %s, %s, %s, %s)",
        (user.firstName, user.lastName, user.email, user.birth, user.postalCode, user.ville)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return user