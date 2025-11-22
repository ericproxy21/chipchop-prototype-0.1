import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FlowNavigator } from './FlowNavigator';
import { SourceView } from './SourceView';
import { Editor } from './Editor';
import { TclConsole } from './TclConsole';
import { GitControls } from './GitControls';
import { CollaborationStatus } from './CollaborationStatus';

export const Workspace = () => {
    const { projectId } = useParams();
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="flex h-screen bg-vivado-bg text-vivado-text overflow-hidden">
            {/* Left Sidebar - Flow Navigator */}
            <div className="w-64 border-r border-vivado-border flex flex-col">
                <div className="p-4 border-b border-vivado-border font-bold bg-vivado-panel">
                    Flow Navigator
                </div>
                <FlowNavigator />
            </div>

            {/* Middle - Sources and Hierarchy */}
            <div className="w-64 border-r border-vivado-border flex flex-col bg-vivado-panel">
                <div className="p-2 border-b border-vivado-border font-semibold text-sm">
                    Sources
                </div>
                <SourceView projectId={projectId} onFileSelect={setActiveFile} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar - Git Controls & Collaboration */}
                <div className="flex justify-between bg-vivado-panel border-b border-vivado-border">
                    <GitControls projectId={projectId} />
                    <CollaborationStatus username={user.username} />
                </div>

                {/* Editor / Viewer */}
                <div className="flex-1 bg-vivado-bg relative">
                    {activeFile ? (
                        <Editor fileId={activeFile} />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            Select a file to view
                        </div>
                    )}
                </div>

                {/* Bottom Panel - Tcl Console / Messages */}
                <div className="h-48 border-t border-vivado-border bg-vivado-panel flex flex-col">
                    <TclConsole projectId={projectId} />
                </div>
            </div>
        </div>
    );
};
