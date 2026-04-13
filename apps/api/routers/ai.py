"""
AI router - OpenAI integration for tutoring, quiz generation, summarization
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from openai import AsyncOpenAI
import json

from core.config import settings
from core.security import get_current_user
from models import User, Lesson, LessonProgress
from schemas.ai import (
    AskRequest,
    AskResponse,
    QuizRequest,
    QuizResponse,
    SummarizeRequest,
    SummarizeResponse,
)

router = APIRouter()
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


@router.post("/ask", response_model=AskResponse)
async def ask_ai_tutor(
    request: AskRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Ask the AI tutor a question about a specific lesson.
    Context-aware responses using lesson content.
    """
    
    # Build context from lesson
    context = f"""
Lesson Title: {request.lesson_title}
Course: {request.course_title}
Lesson Content: {request.lesson_content or "No content provided"}

User Question: {request.question}
"""
    
    messages = [
        {
            "role": "system",
            "content": """You are an expert AI tutor for EduSpark, an educational platform.
Your role is to help students understand concepts clearly and concisely.
Use simple analogies when helpful. Keep responses under 200 words unless necessary.
Be encouraging but professional. If the question is outside the lesson scope, 
gently redirect to the lesson content."""
        },
        {
            "role": "user",
            "content": context
        }
    ]
    
    try:
        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            max_tokens=settings.MAX_TOKENS,
            temperature=settings.TEMPERATURE,
        )
        
        answer = response.choices[0].message.content
        
        # Generate follow-up questions
        followup_prompt = f"""Based on this question and answer, suggest 3 follow-up questions 
the student might want to ask next. Format as a JSON array of strings.

Question: {request.question}
Answer: {answer}"""
        
        followup_response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": followup_prompt}
            ],
            max_tokens=200,
            temperature=0.7,
        )
        
        try:
            follow_up_questions = json.loads(followup_response.choices[0].message.content)
        except:
            follow_up_questions = [
                "Can you explain that differently?",
                "How does this apply in real life?",
                "What should I learn next?"
            ]
        
        return AskResponse(
            answer=answer,
            follow_up_questions=follow_up_questions,
            confidence_score=0.95,
            sources_referenced=[request.lesson_title] if request.lesson_title else [],
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")


@router.post("/generate-quiz", response_model=QuizResponse)
async def generate_quiz(
    request: QuizRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Generate a quiz based on lesson content.
    Returns multiple choice questions with explanations.
    """
    
    prompt = f"""Generate a {request.num_questions}-question multiple choice quiz based on the following lesson content.
Make questions that test understanding, not just memorization.

Lesson Title: {request.lesson_title}
Content: {request.lesson_content}

Return JSON in this exact format:
{{
  "questions": [
    {{
      "id": 1,
      "question": "question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correct_answer": 0,
      "explanation": "why this is correct"
    }}
  ]
}}"""
    
    try:
        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert educational quiz creator."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.7,
            response_format={"type": "json_object"},
        )
        
        quiz_data = json.loads(response.choices[0].message.content)
        
        return QuizResponse(
            lesson_id=request.lesson_id,
            questions=quiz_data["questions"],
            estimated_time_minutes=len(quiz_data["questions"]) * 2,
            difficulty="adaptive",
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation error: {str(e)}")


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_lesson(
    request: SummarizeRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Generate a concise summary of lesson content.
    Useful for quick review or catching up.
    """
    
    max_length = 100 if request.summary_type == "brief" else 300
    
    prompt = f"""Summarize the following lesson content in {max_length} words or less.
Focus on the key concepts and actionable takeaways.

Lesson Title: {request.lesson_title}
Content: {request.content}

Format your response as:
- Key Points (bullet points)
- Main Takeaway (1-2 sentences)
- Next Steps (what to focus on next)"""
    
    try:
        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert at distilling complex information into clear summaries."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.5,
        )
        
        summary = response.choices[0].message.content
        
        # Generate key terms
        terms_prompt = f"""Extract 5-7 key terms/concepts from this lesson.
Return as a JSON array of objects with 'term' and 'definition' keys.

Content: {request.content}"""
        
        terms_response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[{"role": "user", "content": terms_prompt}],
            max_tokens=500,
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        
        try:
            key_terms_data = json.loads(terms_response.choices[0].message.content)
            key_terms = key_terms_data.get("terms", [])
        except:
            key_terms = []
        
        return SummarizeResponse(
            summary=summary,
            key_terms=key_terms,
            word_count=len(summary.split()),
            estimated_reading_time=len(summary.split()) // 200 + 1,
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization error: {str(e)}")


@router.post("/generate-course")
async def generate_course_outline(
    topic: str,
    target_audience: str = "beginner",
    current_user: User = Depends(get_current_user),
):
    """
    Generate a course outline using AI.
    For instructors to kickstart course creation.
    """
    
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can use this feature")
    
    prompt = f"""Create a comprehensive course outline for: {topic}
Target Audience: {target_audience}

Return JSON in this format:
{{
  "title": "Compelling course title",
  "description": "Course description (2-3 sentences)",
  "estimated_duration": "e.g., '4 hours'",
  "difficulty": "beginner|intermediate|advanced",
  "modules": [
    {{
      "title": "Module title",
      "lessons": ["Lesson 1", "Lesson 2", "Lesson 3"]
    }}
  ],
  "prerequisites": ["prerequisite 1", "prerequisite 2"],
  "learning_outcomes": ["outcome 1", "outcome 2"]
}}"""
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert curriculum designer."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.7,
            response_format={"type": "json_object"},
        )
        
        outline = json.loads(response.choices[0].message.content)
        return outline
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Course generation error: {str(e)}")
