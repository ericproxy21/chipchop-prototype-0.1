import { FileCode, Folder } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SourceViewProps {
    onFileSelect: (file: string) => void;
    projectId?: string;
}

interface FileItem {
    name: string;
    type: string;
    path: string;
}

export const SourceView = ({ onFileSelect, projectId }: SourceViewProps) => {
    const [files, setFiles] = useState<FileItem[]>([
        { name: 'gcd_accelerator.v', type: 'verilog', path: 'rtl/gcd_accelerator.v' },
        { name: 'constraints.xdc', type: 'xdc', path: 'constraints.xdc' },
    ]);

    useEffect(() => {
        if (projectId) {
            // TODO: Fetch actual files from backend
            // For now, use default GCD accelerator files
            setFiles([
                { name: 'gcd_accelerator.v', type: 'verilog', path: 'rtl/gcd_accelerator.v' },
                { name: 'constraints.xdc', type: 'xdc', path: 'constraints.xdc' },
            ]);
        }
    }, [projectId]);

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
                        onClick={() => onFileSelect(file.path)}
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
