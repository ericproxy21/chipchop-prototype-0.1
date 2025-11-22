from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import time

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = {}

class ChatResponse(BaseModel):
    reply: str
    actions: List[str] = []

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    msg = request.message.lower()
    
    # Mock AI Logic
    if "counter" in msg:
        return ChatResponse(
            reply="Here is a simple 4-bit counter in Verilog:\n\n```verilog\nmodule counter (\n    input clk,\n    input rst,\n    output reg [3:0] count\n);\n    always @(posedge clk or posedge rst) begin\n        if (rst)\n            count <= 4'b0000;\n        else\n            count <= count + 1;\n    end\nendmodule\n```",
            actions=["Create File"]
        )
    elif "synthesis" in msg:
        return ChatResponse(
            reply="To run synthesis, you can use the Flow Navigator on the left. Would you like me to start a synthesis run for you?",
            actions=["Run Synthesis"]
        )
    elif "bitstream" in msg:
        return ChatResponse(
            reply="Bitstream generation requires a completed implementation run. Please ensure timing constraints are met first.",
            actions=[]
        )
    else:
        return ChatResponse(
            reply="I can help you with RTL coding, synthesis, implementation, and more. Try asking me to 'create a counter' or 'help with synthesis'.",
            actions=[]
        )
