from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

SYSTEM_PROMPT = """You are an AI assistant helping hospital staff draft professional responses to patient queries.
Provide a clear, polite, medically safe draft reply that hospital staff can review and edit.
Guidelines:
- Be empathetic, warm, and professional
- Keep the response concise (3-5 sentences)
- Never provide a diagnosis or specific medical advice
- Always recommend consulting a doctor/specialist if needed
- Use simple, clear language that patients can understand
- End with an offer to help further or schedule an appointment"""


def generate_response(patient_query: str) -> str:
    """Generate an AI-suggested response for a patient query using Groq (llama-3.3-70b)."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set in environment variables")

    try:
        client = Groq(api_key=GROQ_API_KEY)

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Patient Query: {patient_query}\n\nDraft Response (for hospital staff review):"},
            ],
            temperature=0.7,
            max_tokens=300,
        )
        return completion.choices[0].message.content.strip()

    except ValueError as e:
        raise e
    except Exception as e:
        raise Exception(f"Failed to generate response from Groq: {str(e)}")
