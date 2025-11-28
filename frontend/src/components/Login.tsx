import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) throw new Error('Login failed');

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-vivado-bg">
            <div className="bg-vivado-panel p-8 rounded-lg shadow-lg border border-vivado-border w-96">
                <h1 className="text-2xl font-bold mb-6 text-vivado-text text-center">Chipchop Prototype 0.1</h1>
                {error && <div className="bg-red-900/50 text-red-200 p-2 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-vivado-bg border border-vivado-border rounded p-2 text-vivado-text focus:outline-none focus:border-vivado-accent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-vivado-bg border border-vivado-border rounded p-2 text-vivado-text focus:outline-none focus:border-vivado-accent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-vivado-accent hover:bg-blue-600 text-white font-medium py-2 rounded transition-colors"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};
