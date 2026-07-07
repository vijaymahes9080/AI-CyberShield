from fastapi import APIRouter, Depends, HTTPException
import schemas
from agent_orchestrator import orchestrator

router = APIRouter(prefix="/agent", tags=["AI Security Assistant"])

@router.post("/chat", response_model=schemas.AgentChatResponse)
def chat_with_agents(request: schemas.AgentChatRequest):
    result = orchestrator.process_prompt(request.message, request.session_id)
    return schemas.AgentChatResponse(
        response=result["response"],
        session_id=result["session_id"],
        orchestrator_log=[
            schemas.AgentLogEntry(agent=log["agent"], action=log["action"])
            for log in result["orchestrator_log"]
        ]
    )
