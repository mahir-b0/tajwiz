from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import random
from questions import questions

app = FastAPI(title="Tajwiz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class QuizRequest(BaseModel):
    topics: List[str]
    count: int


@app.get("/")
def root():
    return {"message": "Tajwiz API is running"}


@app.get("/topics")
def get_topics():
    return {
        "topics": [
            {"id": "noon_sakinah", "label": "Noon Sakinah"},
            {"id": "qalqalah", "label": "Qalqalah"},
            {"id": "waqf", "label": "Waqf Signs"}
        ]
    }


@app.post("/quiz")
def generate_quiz(req: QuizRequest):
    if not req.topics:
        raise HTTPException(status_code=400, detail="Select at least one topic")
    if req.count < 1 or req.count > 30:
        raise HTTPException(status_code=400, detail="Count must be between 1 and 30")

    pool = []
    for topic in req.topics:
        if topic in questions:
            pool.extend(questions[topic])

    if not pool:
        raise HTTPException(status_code=400, detail="No questions found for selected topics")

    count = min(req.count, len(pool))
    selected = random.sample(pool, count)

    # Shuffle answer options for each question
    for q in selected:
        opts = q["options"][:]
        random.shuffle(opts)
        q["options"] = opts

    return {"questions": selected, "total": count}
