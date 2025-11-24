import { useState, useEffect, useRef } from 'react';
import { Users } from 'lucide-react';

interface CollaborationStatusProps {
    username: string;
}

export const CollaborationStatus = ({ username }: CollaborationStatusProps) => {
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!username) return;

        const socket = new WebSocket(`ws://localhost:8000/api/collab/ws/${username}`);
        ws.current = socket;

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'users_update') {
                setOnlineUsers(Object.keys(data.users));
            }
        };

        return () => {
            socket.close();
        };
    }, [username]);

    return (
        <div className="flex items-center gap-2 px-4 py-1 bg-vivado-panel border-l border-vivado-border text-xs">
            <Users size={14} className="text-green-500" />
            <span>{onlineUsers.length} Online:</span>
            <div className="flex gap-1">
                {onlineUsers.map((user) => (
                    <span key={user} className="bg-vivado-bg px-1 rounded border border-vivado-border">
                        {user}
                    </span>
                ))}
            </div>
        </div>
    );
};
