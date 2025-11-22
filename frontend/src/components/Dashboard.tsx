import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder, GitBranch, Clock } from 'lucide-react';

interface Project {
    id: string;
    name: string;
    path: string;
    created_at: string;
    last_modified: string;
}

export const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [projects, setProjects] = useState<Project[]>([]);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/projects/');
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            }
        } catch (error) {
            console.error('Failed to fetch projects', error);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/projects/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newProjectName }),
            });

            if (response.ok) {
                setShowNewProjectModal(false);
                setNewProjectName('');
                fetchProjects();
            }
        } catch (error) {
            console.error('Failed to create project', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-vivado-bg text-vivado-text p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">ChipChop Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back, {user.username}</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowNewProjectModal(true)}
                        className="bg-vivado-accent hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                    >
                        <Plus size={18} /> New Project
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-vivado-panel border border-vivado-border px-4 py-2 rounded hover:bg-vivado-border transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => navigate(`/workspace/${project.id}`)}
                        className="bg-vivado-panel border border-vivado-border p-6 rounded-lg hover:border-vivado-accent cursor-pointer transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-vivado-bg rounded border border-vivado-border group-hover:border-vivado-accent transition-colors">
                                <Folder className="text-vivado-accent" size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <GitBranch size={12} />
                                <span>main</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock size={14} />
                            <span>{new Date(project.last_modified).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="col-span-3 text-center py-12 text-gray-500">
                        No projects found. Create one to get started.
                    </div>
                )}
            </div>

            {showNewProjectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-vivado-panel p-6 rounded-lg border border-vivado-border w-96 shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
                        <form onSubmit={handleCreateProject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-gray-400">Project Name</label>
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    className="w-full bg-vivado-bg border border-vivado-border rounded p-2 text-vivado-text focus:outline-none focus:border-vivado-accent"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowNewProjectModal(false)}
                                    className="px-4 py-2 rounded hover:bg-vivado-border transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-vivado-accent hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
