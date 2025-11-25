import { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';

interface ArchitectureEditorProps {
    isOpen: boolean;
    onClose: () => void;
    initialContent?: string;
    onSave?: (content: string) => void;
}

export const ArchitectureEditor = ({ isOpen, onClose, initialContent = '', onSave }: ArchitectureEditorProps) => {
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (onSave) {
            onSave(content);
        }
        // In a real app, this would save to the backend
        localStorage.setItem('project_architecture_specs', content);
        alert('Architecture specifications saved!');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-vivado-panel border border-vivado-border rounded-lg w-[800px] h-[80vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-vivado-border">
                    <h2 className="text-xl font-bold text-vivado-text flex items-center gap-2">
                        <FileText size={20} className="text-vivado-accent" />
                        Architecture Specifications
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            className="px-3 py-1.5 bg-vivado-accent hover:bg-blue-600 rounded text-white text-sm flex items-center gap-1 transition-colors"
                        >
                            <Save size={16} /> Save
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-vivado-border rounded text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 bg-vivado-bg flex flex-col">
                    <div className="mb-2 text-sm text-gray-400">
                        Describe the high-level specifications, requirements, and architectural decisions for your project.
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 w-full bg-gray-900 border border-vivado-border rounded p-4 text-gray-200 font-mono text-sm focus:outline-none focus:border-vivado-accent resize-none leading-relaxed"
                        placeholder="# Project Architecture
                        
1. Overview
   ...

2. Requirements
   ...

3. Modules
   ..."
                    />
                </div>
            </div>
        </div>
    );
};
