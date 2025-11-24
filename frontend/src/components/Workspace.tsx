import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FlowNavigator } from './FlowNavigator';
import { SourceView } from './SourceView';
import { Editor } from './Editor';
import { TclConsole } from './TclConsole';
import { GitControls } from './GitControls';
import { CollaborationStatus } from './CollaborationStatus';
import { CloudConnectModal } from './CloudConnectModal';
import { ReportsModal } from './ReportsModal';
import { RunProgressModal } from './RunProgressModal';
import { SchematicModal } from './SchematicModal';
import { Copilot } from './Copilot';
import { PanelRight } from 'lucide-react';

export const Workspace = () => {
    const { projectId } = useParams();
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [showCopilot, setShowCopilot] = useState(true);
    const [showCloudModal, setShowCloudModal] = useState(false);
    const [showReportsModal, setShowReportsModal] = useState(false);
    const [showRunModal, setShowRunModal] = useState(false);
    const [showSchematicModal, setShowSchematicModal] = useState(false);
    const [reportType, setReportType] = useState<'synthesis' | 'implementation' | 'bitstream'>('synthesis');
    const [runType, setRunType] = useState<'synthesis' | 'implementation' | 'bitstream'>('synthesis');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleViewReports = (type: 'synthesis' | 'implementation' | 'bitstream') => {
        setReportType(type);
        setShowReportsModal(true);
    };

    const handleRunProcess = (type: 'synthesis' | 'implementation' | 'bitstream') => {
        setRunType(type);
        setShowRunModal(true);
    };

    return (
        <div className="flex h-screen bg-vivado-bg text-vivado-text overflow-hidden">
            {/* Left Sidebar - Flow Navigator */}
            <div className="w-64 border-r border-vivado-border flex flex-col">
                <div className="p-4 border-b border-vivado-border font-bold bg-vivado-panel">
                    Flow Navigator
                </div>
                <FlowNavigator
                    onCloudConnect={() => setShowCloudModal(true)}
                    onViewReports={handleViewReports}
                    onRunProcess={handleRunProcess}
                    onViewSchematic={() => setShowSchematicModal(true)}
                />
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
                <div className="flex justify-between items-center bg-vivado-panel border-b border-vivado-border pr-2">
                    <GitControls projectId={projectId} />
                    <div className="flex items-center gap-2">
                        <CollaborationStatus username={user.username} />
                        <button
                            onClick={() => setShowCopilot(!showCopilot)}
                            className={`p-1 rounded hover:bg-vivado-border ${showCopilot ? 'text-vivado-accent' : 'text-gray-400'}`}
                            title="Toggle Copilot"
                        >
                            <PanelRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Editor / Viewer */}
                    <div className="flex-1 bg-vivado-bg relative flex flex-col">
                        <div className="flex-1 relative">
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

                    {/* Right Sidebar - Copilot */}
                    {showCopilot && <Copilot onClose={() => setShowCopilot(false)} />}
                </div>
            </div>

            <CloudConnectModal
                isOpen={showCloudModal}
                onClose={() => setShowCloudModal(false)}
                projectId={projectId || ''}
            />

            <ReportsModal
                isOpen={showReportsModal}
                onClose={() => setShowReportsModal(false)}
                reportType={reportType}
            />

            <RunProgressModal
                isOpen={showRunModal}
                onClose={() => setShowRunModal(false)}
                runType={runType}
            />

            <SchematicModal
                isOpen={showSchematicModal}
                onClose={() => setShowSchematicModal(false)}
            />
        </div>
    );
};
