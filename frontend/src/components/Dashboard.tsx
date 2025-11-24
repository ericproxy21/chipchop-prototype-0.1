import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder, GitBranch, Clock, Settings, Users } from 'lucide-react';
import { ProjectSettingsModal } from './ProjectSettingsModal';

interface Member {
    id: string;
    username: string;
    email: string;
    role: 'edit' | 'read' | 'comment';
    initials: string;
    color: string;
}

interface Project {
    id: string;
    name: string;
    description?: string;
    path: string;
    created_at: string;
    last_modified: string;
    members: Member[];
}

export const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [projects, setProjects] = useState<Project[]>([]);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/projects/');
            if (response.ok) {
                const data = await response.json();
                // Add mock members for demo
                const projectsWithMembers = data.map((p: Project) => ({
                    ...p,
                    members: p.members || [
                        { id: '1', username: 'sarah', email: 'sarah@example.com', role: 'edit', initials: 'SH', color: '#0f766e' },
                        { id: '2', username: 'eric', email: 'eric@example.com', role: 'edit', initials: 'EL', color: '#c2410c' },
                        { id: '3', username: 'alex', email: 'alex@example.com', role: 'read', initials: 'AG', color: '#1d4ed8' },
                    ]
                }));
                setProjects(projectsWithMembers);
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
                body: JSON.stringify({
                    name: newProjectName,
                    description: newProjectDescription
                }),
            });

            if (response.ok) {
                setShowNewProjectModal(false);
                setNewProjectName('');
                setNewProjectDescription('');
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

    const handleOpenSettings = (project: Project, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedProject(project);
        setShowSettingsModal(true);
    };

    const handleMembersUpdate = (projectId: string, members: Member[]) => {
        setProjects(projects.map(p =>
            p.id === projectId ? { ...p, members } : p
        ));
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
                        className="bg-vivado-panel border border-vivado-border p-6 rounded-lg hover:border-vivado-accent cursor-pointer transition-all group relative"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-vivado-bg rounded border border-vivado-border group-hover:border-vivado-accent transition-colors">
                                <Folder className="text-vivado-accent" size={24} />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <GitBranch size={12} />
                                    <span>main</span>
                                </div>
                                <button
                                    onClick={(e) => handleOpenSettings(project, e)}
                                    className="p-1.5 hover:bg-vivado-border rounded transition-colors text-gray-400 hover:text-vivado-accent"
                                    title="Project Settings"
                                >
                                    <Settings size={16} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                        {project.description && (
                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                        )}

                        {/* Members Section */}
                        <div className="mb-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Users size={14} className="text-gray-400" />
                                <span className="text-xs text-gray-400">Members</span>
                                <span className="text-xs bg-vivado-bg px-1.5 py-0.5 rounded text-gray-300">{project.members.length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {project.members.slice(0, 5).map((member) => (
                                    <div
                                        key={member.id}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-vivado-panel"
                                        style={{ backgroundColor: member.color }}
                                        title={`${member.username} (${member.role})`}
                                    >
                                        {member.initials}
                                    </div>
                                ))}
                                {project.members.length > 5 && (
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 text-gray-300 text-xs font-medium border-2 border-vivado-panel">
                                        +{project.members.length - 5}
                                    </div>
                                )}
                            </div>
                        </div>

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
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-gray-400">Description (Optional)</label>
                                <textarea
                                    value={newProjectDescription}
                                    onChange={(e) => setNewProjectDescription(e.target.value)}
                                    className="w-full bg-vivado-bg border border-vivado-border rounded p-2 text-vivado-text focus:outline-none focus:border-vivado-accent resize-none"
                                    rows={3}
                                    placeholder="Enter a brief description of your project..."
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

            {showSettingsModal && selectedProject && (
                <ProjectSettingsModal
                    isOpen={showSettingsModal}
                    onClose={() => setShowSettingsModal(false)}
                    projectId={selectedProject.id}
                    projectName={selectedProject.name}
                    members={selectedProject.members}
                    onMembersUpdate={(members) => handleMembersUpdate(selectedProject.id, members)}
                />
            )}
        </div>
    );
};
