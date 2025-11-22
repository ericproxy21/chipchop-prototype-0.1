from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_status: Dict[str, str] = {} # username -> status

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.user_status[username] = "online"
        await self.broadcast_status()

    def disconnect(self, websocket: WebSocket, username: str):
        self.active_connections.remove(websocket)
        if username in self.user_status:
            del self.user_status[username]

    async def broadcast_status(self):
        for connection in self.active_connections:
            try:
                await connection.send_json({
                    "type": "users_update",
                    "users": self.user_status
                })
            except:
                pass

manager = ConnectionManager()

@router.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await manager.connect(websocket, username)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle other messages (e.g. file locks) here
    except WebSocketDisconnect:
        manager.disconnect(websocket, username)
        await manager.broadcast_status()
