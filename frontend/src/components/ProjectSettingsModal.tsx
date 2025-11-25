import { useState } from 'react';
import { X, UserPlus, Trash2, Settings as SettingsIcon } from 'lucide-react';

interface Member {
    id: string;
    username: string;
    email: string;
    role: 'edit' | 'read' | 'comment';
    initials: string;
    color: string;
}

interface ProjectSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    projectName: string;
    architecture?: string;
    members: Member[];
    onMembersUpdate: (members: Member[]) => void;
}

export const ProjectSettingsModal = ({
    isOpen,
    onClose,
    projectId: _projectId,
    projectName,
    architecture,
    members,
    onMembersUpdate
}: ProjectSettingsModalProps) => {
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberRole, setNewMemberRole] = useState<'edit' | 'read' | 'comment'>('read');
    const [localMembers, setLocalMembers] = useState<Member[]>(members);

    if (!isOpen) return null;

    const getInitials = (email: string) => {
        const name = email.split('@')[0];
        return name.substring(0, 2).toUpperCase();
    };

    const getRandomColor = () => {
        const colors = [
            '#0f766e', // teal
            '#c2410c', // orange
            '#1d4ed8', // blue
            '#7c2d12', // brown
            '#4c1d95', // purple
            '#be123c', // rose
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemberEmail.trim()) return;

        const newMember: Member = {
            id: Date.now().toString(),
            username: newMemberEmail.split('@')[0],
            email: newMemberEmail,
            role: newMemberRole,
            initials: getInitials(newMemberEmail),
            color: getRandomColor(),
        };

        const updatedMembers = [...localMembers, newMember];
        setLocalMembers(updatedMembers);
        onMembersUpdate(updatedMembers);
        setNewMemberEmail('');
        setNewMemberRole('read');
    };

    const handleRemoveMember = (memberId: string) => {
        const updatedMembers = localMembers.filter(m => m.id !== memberId);
        setLocalMembers(updatedMembers);
        onMembersUpdate(updatedMembers);
    };

    const handleRoleChange = (memberId: string, newRole: 'edit' | 'read' | 'comment') => {
        const updatedMembers = localMembers.map(m =>
            m.id === memberId ? { ...m, role: newRole } : m
        );
        setLocalMembers(updatedMembers);
        onMembersUpdate(updatedMembers);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-vivado-panel border border-vivado-border rounded-lg w-[700px] max-h-[80vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-vivado-border">
                    <div>
                        <h2 className="text-xl font-bold text-vivado-text flex items-center gap-2">
                            <SettingsIcon size={20} className="text-vivado-accent" />
                            Project Settings
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">{projectName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* General Settings Section */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <SettingsIcon size={18} className="text-vivado-accent" />
                                General
                            </h3>
                            <div className="bg-vivado-bg border border-vivado-border rounded p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-400">
                                            Target Architecture
                                        </label>
                                        <div className="text-vivado-text font-medium">
                                            {architecture || 'Not specified'}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-400">
                                            Project ID
                                        </label>
                                        <div className="text-vivado-text font-mono text-sm">
                                            {_projectId}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Add Member Section */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <UserPlus size={18} className="text-vivado-accent" />
                                Add Team Member
                            </h3>
                            <form onSubmit={handleAddMember} className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-400">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={newMemberEmail}
                                        onChange={(e) => setNewMemberEmail(e.target.value)}
                                        placeholder="colleague@example.com"
                                        className="w-full bg-vivado-bg border border-vivado-border rounded p-2 text-vivado-text focus:outline-none focus:border-vivado-accent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-400">
                                        Access Level
                                    </label>
                                    <select
                                        value={newMemberRole}
                                        onChange={(e) => setNewMemberRole(e.target.value as 'edit' | 'read' | 'comment')}
                                        className="w-full bg-vivado-bg border border-vivado-border rounded p-2 text-vivado-text focus:outline-none focus:border-vivado-accent"
                                    >
                                        <option value="read">Read Only</option>
                                        <option value="comment">Comment</option>
                                        <option value="edit">Edit</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-vivado-accent hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                                >
                                    <UserPlus size={16} />
                                    Add Member
                                </button>
                            </form>
                        </div>

                        {/* Current Members Section */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">
                                Team Members ({localMembers.length})
                            </h3>
                            <div className="space-y-2">
                                {localMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between p-3 bg-vivado-bg border border-vivado-border rounded hover:border-vivado-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                                style={{ backgroundColor: member.color }}
                                            >
                                                {member.initials}
                                            </div>
                                            <div>
                                                <div className="font-medium text-vivado-text">{member.username}</div>
                                                <div className="text-xs text-gray-400">{member.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={member.role}
                                                onChange={(e) => handleRoleChange(member.id, e.target.value as 'edit' | 'read' | 'comment')}
                                                className="bg-vivado-panel border border-vivado-border rounded px-3 py-1 text-sm text-vivado-text focus:outline-none focus:border-vivado-accent"
                                            >
                                                <option value="read">Read Only</option>
                                                <option value="comment">Comment</option>
                                                <option value="edit">Edit</option>
                                            </select>
                                            <button
                                                onClick={() => handleRemoveMember(member.id)}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                                                title="Remove member"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {localMembers.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No team members yet. Add someone to collaborate!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-vivado-border flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-vivado-accent hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
