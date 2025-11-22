import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface GitControlsProps {
    projectId?: string;
}

export const GitControls = ({ projectId }: GitControlsProps) => {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [commitMessage, setCommitMessage] = useState('');
    const [showCommitModal, setShowCommitModal] = useState(false);

    const fetchStatus = async () => {
        if (!projectId) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/git/${projectId}/status`);
            if (response.ok) {
                const data = await response.json();
                setStatus(data);
            }
        } catch (error) {
            console.error('Failed to fetch git status', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [projectId]);

    const handleCommit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId) return;

        try {
            const response = await fetch(`http://localhost:8000/api/git/${projectId}/commit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: commitMessage }),
            });

            if (response.ok) {
                setShowCommitModal(false);
                setCommitMessage('');
                fetchStatus();
            }
        } catch (error) {
            console.error('Failed to commit', error);
        }
    };

    const handleInit = async () => {
        if (!projectId) return;
        try {
            await fetch(`http://localhost:8000/api/git/${projectId}/init`, { method: 'POST' });
            fetchStatus();
        } catch (error) {
            console.error('Failed to init git', error);
        }
    };

    if (!status) return null;

    return (
        <div className="flex items-center gap-4 px-4 py-2 bg-vivado-panel border-b border-vivado-border">
            <div className="flex items-center gap-2 text-sm">
                <GitBranch size={16} className="text-vivado-accent" />
                <span>{status.branch}</span>
            </div>

            {status.branch === 'none' ? (
                <button
                    onClick={handleInit}
                    className="text-xs bg-vivado-accent px-2 py-1 rounded text-white hover:bg-blue-600"
                >
                    Init Git
                </button>
            ) : (
                <>
                    <div className="flex items-center gap-2 text-xs">
                        {status.is_clean ? (
                            <span className="text-green-500 flex items-center gap-1"><Check size={12} /> Clean</span>
                        ) : (
                            <span className="text-yellow-500 flex items-center gap-1"><AlertCircle size={12} /> {status.changed_files.length} changes</span>
                        )}
                    </div>

                    {!status.is_clean && (
                        <button
                            onClick={() => setShowCommitModal(true)}
                            className="text-xs bg-vivado-accent px-2 py-1 rounded text-white hover:bg-blue-600 flex items-center gap-1"
                        >
                            <GitCommit size={12} /> Commit
                        </button>
                    )}
                </>
            )}

            <button onClick={fetchStatus} className={`text-gray-400 hover:text-white ${loading ? 'animate-spin' : ''}`}>
                <RefreshCw size={14} />
            </button>

            {showCommitModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-vivado-panel p-4 rounded border border-vivado-border w-80 shadow-xl">
                        <h3 className="font-bold mb-2">Commit Changes</h3>
                        <form onSubmit={handleCommit}>
                            <textarea
                                value={commitMessage}
                                onChange={(e) => setCommitMessage(e.target.value)}
                                className="w-full h-24 bg-vivado-bg border border-vivado-border rounded p-2 text-sm mb-4 focus:outline-none focus:border-vivado-accent"
                                placeholder="Commit message..."
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCommitModal(false)}
                                    className="px-3 py-1 text-sm rounded hover:bg-vivado-border"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1 text-sm bg-vivado-accent text-white rounded hover:bg-blue-600"
                                >
                                    Commit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
