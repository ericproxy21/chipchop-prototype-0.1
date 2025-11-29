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
            // Encode fileId to handle slashes in path
            // const encodedFileId = encodeURIComponent(fileId);
            // But wait, the backend expects the filename directly. 
            // If fileId is "rtl/gcd_accelerator.v", backend joins it with project path.
            // Let's check backend: os.path.join(project_path, filename)
            // So "rtl/gcd_accelerator.v" works if we pass it as is? 
            // FastAPI might decode the URL param.
            // Ideally we should pass it as a query param or handle slashes.
            // But let's try passing it directly first, assuming backend handles it or we use a different endpoint structure.
            // Actually, "files/{filename}" where filename contains slashes might be tricky in some routers.
            // Let's assume for now we can pass it. If not, we might need to adjust backend.
            // Wait, standard URL encoding should work if backend decodes it.

            // Actually, let's look at backend: @router.get("/{project_id}/files/{filename}")
            // If filename has slashes, it might not match.
            // We should check if we need to use a catch-all path or query param.
            // For now, let's try encoded.

            const response = await fetch(`http://localhost:8000/api/projects/${projectId}/files/${encodeURIComponent(fileId)}`);
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
            const response = await fetch(`http://localhost:8000/api/projects/${projectId}/files/${encodeURIComponent(fileId)}`, {
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
