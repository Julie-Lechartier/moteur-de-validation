import mysql.connector
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/users")
async def get_users():
    conn = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "db"),
        database=os.getenv("MYSQL_DATABASE", "ynov_ci"),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD", "ynovpwd"),
        port=3306
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    records = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"users": [dict(row) for row in records]}
