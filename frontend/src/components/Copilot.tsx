import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    actions?: string[];
}

interface CopilotProps {
    onClose: () => void;
}

export const Copilot = ({ onClose }: CopilotProps) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am your FPGA Copilot. I can help you write RTL, run synthesis, or answer questions about the flow.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/copilot/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.reply,
                    actions: data.actions
                }]);
            }
        } catch (error) {
            console.error('Failed to get copilot response', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-vivado-panel border-l border-vivado-border w-80">
            <div className="p-3 border-b border-vivado-border font-bold flex items-center justify-between bg-vivado-bg">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-vivado-accent" size={18} />
                    <span>Copilot</span>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-vivado-accent' : 'bg-gray-600'}`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.role === 'user' ? 'bg-vivado-accent text-white' : 'bg-vivado-bg text-vivado-text border border-vivado-border'}`}>
                            <div className="whitespace-pre-wrap font-mono text-xs">{msg.content}</div>
                            {msg.actions && msg.actions.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {msg.actions.map((action, i) => (
                                        <button key={i} className="text-xs bg-vivado-panel border border-vivado-accent text-vivado-accent px-2 py-1 rounded hover:bg-vivado-accent hover:text-white transition-colors">
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="bg-vivado-bg border border-vivado-border rounded-lg p-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-vivado-border bg-vivado-bg">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Copilot..."
                        className="w-full bg-vivado-panel border border-vivado-border rounded-md py-2 pl-3 pr-10 text-sm text-vivado-text focus:outline-none focus:border-vivado-accent"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-vivado-accent disabled:opacity-50"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};
