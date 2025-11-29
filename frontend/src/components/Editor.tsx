import { useState, useEffect } from 'react';

interface EditorProps {
    fileId: string;
    projectId: string;
}

export const Editor = ({ fileId, projectId }: EditorProps) => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (fileId && projectId) {
            fetchFileContent();
        } else {
            setContent('');
        }
    }, [fileId, projectId]);

    const fetchFileContent = async () => {
        setIsLoading(true);
        try {
            // Use fileId directly as path parameter (backend uses :path converter)
            // We split by / and encode each segment to be safe
            const safePath = fileId.split('/').map(encodeURIComponent).join('/');

            const response = await fetch(`http://localhost:8000/api/projects/${projectId}/files/${safePath}`);
            if (response.ok) {
                const data = await response.json();
                setContent(data.content || '');
            } else {
                setContent(`// Failed to load file: ${fileId}`);
            }
        } catch (error) {
            console.error('Failed to fetch file content', error);
            setContent(`// Error loading file: ${fileId}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!projectId || !fileId) return;

        try {
            const safePath = fileId.split('/').map(encodeURIComponent).join('/');
            const response = await fetch(`http://localhost:8000/api/projects/${projectId}/files/${safePath}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                // Show success feedback (could be a toast)
                console.log('File saved successfully');
            } else {
                console.error('Failed to save file');
            }
        } catch (error) {
            console.error('Failed to save file', error);
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="bg-vivado-panel border-b border-vivado-border px-4 py-2 text-sm font-mono flex justify-between items-center">
                <span>{fileId}</span>
                <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-vivado-accent hover:bg-blue-600 text-white rounded text-xs transition-colors"
                >
                    Save
                </button>
            </div>
            {isLoading ? (
                <div className="flex-1 bg-vivado-bg text-gray-400 p-4 font-mono text-sm flex items-center justify-center">
                    Loading...
                </div>
            ) : (
                <textarea
                    className="flex-1 bg-vivado-bg text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none"
                    value={content}
                    onChange={handleContentChange}
                    spellCheck={false}
                />
            )}
        </div>
    );
};
