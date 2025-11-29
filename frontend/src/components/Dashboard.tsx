import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder, Clock, Settings, LogOut, Search, Users } from 'lucide-react';
import { ProjectLandingPage } from './ProjectLandingPage';
import { ProjectSettingsModal } from './ProjectSettingsModal';
import { ScaffoldModal } from './ScaffoldModal';
import { exampleProjectData } from '../data/exampleProject';

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
    architecture?: string;
    path: string;
    created_at: string;
    last_modified: string;
    members: Member[];
}

export const Dashboard = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [showLandingPage, setShowLandingPage] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showScaffoldModal, setShowScaffoldModal] = useState(false);
    const [pendingProjectData, setPendingProjectData] = useState<{ name: string; description?: string; architecture?: string } | null>(null);

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

    const handleCreateProject = async (type: 'blank' | 'template' | 'clone', data?: any) => {
        try {
            let projectName = '';
            let description = '';
            let architecture = 'zynq-7000';

            if (type === 'blank' || type === 'template') {
                if (data) {
                    projectName = data.name;
                    description = data.description;
                    architecture = data.architecture;
                } else {
                    // Fallback
                    projectName = prompt('Enter project name:') || '';
                    if (!projectName) return;
                }

                if (type === 'template' && !description) {
                    description = 'Created from template with sample Verilog files';
                }
            } else if (type === 'clone' && data?.repoUrl) {
                const repoName = data.repoUrl.split('/').pop()?.replace('.git', '') || 'cloned-project';
                projectName = repoName;
                description = `Cloned from ${data.repoUrl}`;
            }

            // If it's a blank project, show the scaffold modal first
            if (type === 'blank') {
                setPendingProjectData({ name: projectName, description, architecture });
                setShowScaffoldModal(true);
                return;
            }

            // Otherwise proceed directly
            await finalizeCreateProject({
                name: projectName,
                description,
                architecture,
                type,
                ...(type === 'clone' && { repoUrl: data?.repoUrl })
            });

        } catch (error) {
            console.error('Failed to initiate project creation', error);
        }
    };

    const finalizeCreateProject = async (projectData: any) => {
        try {
            const response = await fetch('http://localhost:8000/api/projects/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData),
            });

            if (response.ok) {
                const newProject = await response.json();
                setShowLandingPage(false);
                setShowScaffoldModal(false);
                setPendingProjectData(null);
                fetchProjects();
                navigate(`/workspace/${newProject.id}`);
            }
        } catch (error) {
            console.error('Failed to create project', error);
        }
    };

    const handleScaffoldConfirm = (specs: string) => {
        if (pendingProjectData) {
            finalizeCreateProject({
                ...pendingProjectData,
                type: 'blank',
                scaffold: true,
                scaffoldSpecs: specs,
                // In a real AI flow, these would be generated based on specs
                // For now we just pass the specs to the backend or handle it there
            });
        }
    };

    const handleDemoScaffold = () => {
        if (pendingProjectData) {
            finalizeCreateProject({
                ...pendingProjectData,
                type: 'blank',
                scaffold: true,
                scaffoldSpecs: "Demo GCD Project",
                architecture_content: exampleProjectData.architectureContent,
                microarchitecture_content: exampleProjectData.microarchitectureContent,
                rtl_content: exampleProjectData.rtlContent
            });
        }
    };

    const handleScaffoldSkip = () => {
        if (pendingProjectData) {
            finalizeCreateProject({
                ...pendingProjectData,
                type: 'blank',
                scaffold: false
            });
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

    const handleMembersUpdate = (projectId: string, updatedMembers: Member[]) => {
        setProjects(projects.map(p =>
            p.id === projectId ? { ...p, members: updatedMembers } : p
        ));

        if (selectedProject && selectedProject.id === projectId) {
            setSelectedProject({ ...selectedProject, members: updatedMembers });
        }
    };

    return (
        <div className="min-h-screen bg-vivado-bg text-vivado-text p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <div className="w-8 h-8 bg-vivado-accent rounded flex items-center justify-center text-white font-bold">
                            CC
                        </div>
                        Chipchop
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="bg-vivado-panel border border-vivado-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-vivado-accent w-64"
                            />
                        </div>
                        <button
                            onClick={() => setShowLandingPage(true)}
                            className="bg-vivado-accent hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                        >
                            <Plus size={18} />
                            New Project
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-vivado-panel rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => navigate(`/ workspace / ${project.id} `)}
                            className="bg-vivado-panel border border-vivado-border rounded-lg p-6 hover:border-vivado-accent cursor-pointer transition-all hover:shadow-lg group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-900/30 rounded-lg text-blue-400 group-hover:text-white group-hover:bg-vivado-accent transition-colors">
                                    <Folder size={24} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-xs font-mono bg-vivado-bg px-2 py-1 rounded text-gray-400 border border-vivado-border">
                                        {project.architecture || 'zynq-7000'}
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

                {showLandingPage && (
                    <div className="fixed inset-0 z-50">
                        <ProjectLandingPage
                            onCreateProject={handleCreateProject}
                            onClose={() => setShowLandingPage(false)}
                        />
                    </div>
                )}

                {showSettingsModal && selectedProject && (
                    <ProjectSettingsModal
                        isOpen={showSettingsModal}
                        onClose={() => setShowSettingsModal(false)}
                        projectId={selectedProject.id}
                        projectName={selectedProject.name}
                        architecture={selectedProject.architecture}
                        members={selectedProject.members}
                        onMembersUpdate={(members) => handleMembersUpdate(selectedProject.id, members)}
                    />
                )}

                <ScaffoldModal
                    isOpen={showScaffoldModal}
                    onClose={() => setShowScaffoldModal(false)}
                    onConfirm={handleScaffoldConfirm}
                    onSkip={handleScaffoldSkip}
                    onDemo={handleDemoScaffold}
                />
            </div>
        </div>
    );
};
