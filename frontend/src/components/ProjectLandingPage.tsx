import { useState } from 'react';
import { FolderPlus, FileCode, GitBranch, X } from 'lucide-react';
import { NewProjectModal } from './NewProjectModal';

interface ProjectLandingPageProps {
    onCreateProject: (type: 'blank' | 'template' | 'clone', data?: any) => void;
    onClose?: () => void;
}

export const ProjectLandingPage = ({ onCreateProject, onClose: _onClose }: ProjectLandingPageProps) => {
    const [showCloneModal, setShowCloneModal] = useState(false);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [projectType, setProjectType] = useState<'blank' | 'template'>('blank');
    const [repoUrl, setRepoUrl] = useState('');

    const handleCloneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateProject('clone', { repoUrl });
        setShowCloneModal(false);
        setRepoUrl('');
    };

    const handleNewProjectClick = (type: 'blank' | 'template') => {
        setProjectType(type);
        setShowNewProjectModal(true);
    };

    const handleNewProjectSubmit = (data: { name: string; description: string; architecture: string }) => {
        onCreateProject(projectType, data);
        setShowNewProjectModal(false);
    };

    return (
        <div className="min-h-screen bg-vivado-bg flex items-center justify-center p-8">
            <div className="w-full max-w-2xl">
                {/* Logo and Title */}
                <div className="text-center mb-12">
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center">
                            <img src="/src/assets/chipchop_logo.jpg" alt="ChipChop Logo" className="w-16 h-16 object-contain" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-light text-gray-200 tracking-wide">Chipchop</h1>
                </div>

                {/* Main Action Buttons */}
                <div className="space-y-4 mb-8">
                    {/* New Project Button */}
                    <button
                        onClick={() => handleNewProjectClick('blank')}
                        className="w-full bg-vivado-accent hover:bg-blue-600 text-white py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                        <FolderPlus size={24} />
                        <span className="text-lg font-medium">New Project</span>
                    </button>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleNewProjectClick('template')}
                            className="bg-vivado-panel hover:bg-gray-700 border border-vivado-border text-gray-200 py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]"
                        >
                            <FileCode size={20} />
                            <span className="font-medium">Template Project</span>
                        </button>

                        <button
                            onClick={() => setShowCloneModal(true)}
                            className="bg-vivado-panel hover:bg-gray-700 border border-vivado-border text-gray-200 py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]"
                        >
                            <GitBranch size={20} />
                            <span className="font-medium">Clone Repository</span>
                        </button>
                    </div>
                </div>

                {/* Recent Projects Section */}
                <div className="mt-12">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Recent Projects
                    </h2>
                    <div className="bg-vivado-panel border border-vivado-border rounded-lg p-4 hover:border-vivado-accent/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-gray-200 font-medium">antigravity1</h3>
                                <p className="text-sm text-gray-500">C:\Users\Eric\Documents\Project</p>
                            </div>
                            <div className="text-xs text-gray-500">
                                Last opened: Today
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clone Repository Modal */}
            {showCloneModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-vivado-panel border border-vivado-border rounded-lg w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <GitBranch size={24} className="text-vivado-accent" />
                                Clone Repository
                            </h2>
                            <button
                                onClick={() => setShowCloneModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCloneSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-400">
                                    Repository URL
                                </label>
                                <input
                                    type="url"
                                    value={repoUrl}
                                    onChange={(e) => setRepoUrl(e.target.value)}
                                    placeholder="https://github.com/username/repository.git"
                                    className="w-full bg-vivado-bg border border-vivado-border rounded-lg p-3 text-white focus:outline-none focus:border-vivado-accent transition-colors"
                                    required
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Enter the Git repository URL you want to clone
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCloneModal(false)}
                                    className="px-4 py-2 rounded-lg hover:bg-vivado-border transition-colors text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-vivado-accent hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                                >
                                    Clone
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* New Project Modal */}
            <NewProjectModal
                isOpen={showNewProjectModal}
                onClose={() => setShowNewProjectModal(false)}
                onSubmit={handleNewProjectSubmit}
                projectType={projectType}
            />
        </div>
    );
};
