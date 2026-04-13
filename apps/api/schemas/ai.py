"""
AI schemas
"""

from pydantic import BaseModel
from typing import List, Optional


class AskRequest(BaseModel):
    question: str
    lesson_id: Optional[str] = None
    lesson_title: Optional[str] = None
    lesson_content: Optional[str] = None
    course_title: Optional[str] = None
    conversation_history: Optional[List[dict]] = []


class AskResponse(BaseModel):
    answer: str
    follow_up_questions: List[str]
    confidence_score: float
    sources_referenced: List[str]


class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: int
    explanation: str


class QuizRequest(BaseModel):
    lesson_id: str
    lesson_title: str
    lesson_content: str
    num_questions: int = 5
    difficulty: str = "adaptive"


class QuizResponse(BaseModel):
    lesson_id: str
    questions: List[QuizQuestion]
    estimated_time_minutes: int
    difficulty: str


class SummarizeRequest(BaseModel):
    content: str
    lesson_title: Optional[str] = None
    summary_type: str = "medium"  # brief, medium, detailed


class KeyTerm(BaseModel):
    term: str
    definition: str


class SummarizeResponse(BaseModel):
    summary: str
    key_terms: List[KeyTerm]
    word_count: int
    estimated_reading_time: int
