import React, { useState } from 'react';
import { Cloud, Upload, CheckCircle, X } from 'lucide-react';

interface CloudConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

export const CloudConnectModal = ({ isOpen, onClose, projectId }: CloudConnectModalProps) => {
    const [provider, setProvider] = useState<'AWS' | 'Azure'>('AWS');
    const [accessKey, setAccessKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [status, setStatus] = useState<'idle' | 'connecting' | 'uploading' | 'success'>('idle');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleDeploy = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('connecting');
        setMessage('Connecting to provider...');

        try {
            // Simulate steps
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStatus('uploading');
            setMessage('Uploading bitstream...');

            const response = await fetch('http://localhost:8000/api/cloud/deploy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider,
                    credentials: { accessKey, secretKey },
                    project_id: projectId
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setStatus('success');
                setMessage(data.message);
            } else {
                throw new Error('Deployment failed');
            }
        } catch (error) {
            setStatus('idle');
            setMessage('Error: Deployment failed. Please check credentials.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-vivado-panel border border-vivado-border rounded-lg w-[500px] p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-vivado-text">
                        <Cloud className="text-vivado-accent" />
                        Cloud FPGA Bring-up
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-8">
                        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                        <h3 className="text-lg font-bold mb-2 text-white">Deployment Successful!</h3>
                        <p className="text-gray-400 mb-6">{message}</p>
                        <button
                            onClick={onClose}
                            className="bg-vivado-accent hover:bg-blue-600 text-white px-6 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleDeploy} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Provider</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setProvider('AWS')}
                                    className={`flex-1 p-3 rounded border ${provider === 'AWS' ? 'border-vivado-accent bg-vivado-accent/10 text-white' : 'border-vivado-border bg-vivado-bg text-gray-400'}`}
                                >
                                    AWS F1
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setProvider('Azure')}
                                    className={`flex-1 p-3 rounded border ${provider === 'Azure' ? 'border-vivado-accent bg-vivado-accent/10 text-white' : 'border-vivado-border bg-vivado-bg text-gray-400'}`}
                                >
                                    Azure NP
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400">Access Key ID</label>
                            <input
                                type="text"
                                value={accessKey}
                                onChange={(e) => setAccessKey(e.target.value)}
                                className="w-full bg-vivado-bg border border-vivado-border rounded p-2 text-vivado-text focus:border-vivado-accent outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400">Secret Access Key</label>
                            <input
                                type="password"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                className="w-full bg-vivado-bg border border-vivado-border rounded p-2 text-vivado-text focus:border-vivado-accent outline-none"
                                required
                            />
                        </div>

                        {message && (
                            <div className={`text-sm ${status === 'idle' ? 'text-red-400' : 'text-vivado-accent'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status !== 'idle'}
                            className="w-full bg-vivado-accent hover:bg-blue-600 disabled:opacity-50 text-white font-medium py-2 rounded flex items-center justify-center gap-2"
                        >
                            {status === 'idle' ? (
                                <>
                                    <Upload size={18} /> Connect & Push Bitstream
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {status === 'connecting' ? 'Connecting...' : 'Uploading...'}
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
