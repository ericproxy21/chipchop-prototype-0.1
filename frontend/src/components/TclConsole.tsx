import React, { useState } from 'react';

interface TclConsoleProps {
    projectId?: string;
}

export const TclConsole = ({ projectId }: TclConsoleProps) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([
        '# Vivado v2024.1 (64-bit)',
        '# SW Build 1234567 on Fri Nov 22 11:00:00 MST 2024',
        `# Current project: ${projectId || 'None'}`,
    ]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setHistory([...history, `vivado% ${input}`, '# Command executed successfully']);
            setInput('');
        }
    };

    return (
        <div className="flex-1 flex flex-col font-mono text-xs">
            <div className="bg-vivado-panel border-b border-vivado-border px-2 py-1 text-gray-400">
                Tcl Console
            </div>
            <div className="flex-1 overflow-y-auto p-2 bg-black text-gray-300">
                {history.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
            <div className="flex items-center gap-2 p-2 bg-vivado-panel border-t border-vivado-border">
                <span className="text-blue-400">vivado%</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent focus:outline-none text-gray-300"
                    placeholder="Type a Tcl command..."
                />
            </div>
        </div>
    );
};
