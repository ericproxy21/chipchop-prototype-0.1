import React from 'react';
import { FileCode, Folder } from 'lucide-react';

interface SourceViewProps {
    projectId?: string;
    onFileSelect: (file: string) => void;
}

export const SourceView = ({ projectId, onFileSelect }: SourceViewProps) => {
    // Mock data for now
    const files = [
        { name: 'top.v', type: 'verilog' },
        { name: 'alu.v', type: 'verilog' },
        { name: 'constraints.xdc', type: 'xdc' },
    ];

    return (
        <div className="flex-1 overflow-y-auto p-2">
            <div className="flex items-center gap-2 px-2 py-1 text-sm text-gray-400">
                <Folder size={14} />
                <span>Design Sources</span>
            </div>
            <div className="ml-4">
                {files.map((file) => (
                    <div
                        key={file.name}
                        onClick={() => onFileSelect(file.name)}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-vivado-border cursor-pointer rounded text-sm"
                    >
                        <FileCode size={14} className="text-blue-400" />
                        <span>{file.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
