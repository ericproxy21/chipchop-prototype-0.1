import { useState } from 'react';
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
import { SchematicEditor } from './SchematicModal';
import { ArchitectureEditor } from './ArchitectureEditor';
import { Copilot } from './Copilot';
import { DesignNavigator } from './DesignNavigator';
import { PanelRight } from 'lucide-react';

export const Workspace = () => {
    const { projectId } = useParams();
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'source' | 'design' | 'schematic'>('source');
    const [showCopilot, setShowCopilot] = useState(true);
    const [showCloudModal, setShowCloudModal] = useState(false);
    const [showReportsModal, setShowReportsModal] = useState(false);
    const [showRunModal, setShowRunModal] = useState(false);
    const [showSchematicModal, setShowSchematicModal] = useState(false);
    const [showArchitectureModal, setShowArchitectureModal] = useState(false);
    const [showMicroarchitectureModal, setShowMicroarchitectureModal] = useState(false);
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
                    onViewArchitecture={() => setShowArchitectureModal(true)}
                    onViewMicroarchitecture={() => setShowMicroarchitectureModal(true)}
                />
            </div>

            {/* Middle - Sources and Hierarchy */}
            <div className="w-64 border-r border-vivado-border flex flex-col bg-vivado-panel">
                <div className="p-2 border-b border-vivado-border font-semibold text-sm">
                    Sources
                </div>
                <SourceView onFileSelect={setActiveFile} />
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
                        {/* Tab Navigation */}
                        <div className="flex border-b border-vivado-border bg-vivado-panel">
                            <button
                                onClick={() => setActiveTab('source')}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'source'
                                    ? 'border-vivado-accent text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                                    }`}
                            >
                                Source
                            </button>
                            <button
                                onClick={() => setActiveTab('design')}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'design'
                                    ? 'border-vivado-accent text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                                    }`}
                            >
                                Design
                            </button>
                            <button
                                onClick={() => setActiveTab('schematic')}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'schematic'
                                    ? 'border-vivado-accent text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                                    }`}
                            >
                                Schematic
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden relative">
                            {activeTab === 'source' && (
                                <Editor
                                    fileId={activeFile || ''}
                                />
                            )}
                            {activeTab === 'design' && (
                                <div className="h-full overflow-auto p-4">
                                    <DesignNavigator projectName={projectId || 'project'} />
                                </div>
                            )}
                            {activeTab === 'schematic' && (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    Select a module to view schematic or use the Flow Navigator
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Copilot */}
                    {showCopilot && (
                        <div className="w-80 border-l border-vivado-border bg-vivado-panel flex flex-col">
                            <Copilot onClose={() => setShowCopilot(false)} />
                        </div>
                    )}
                </div>

                {/* Bottom Panel - Tcl Console */}
                <div className="h-48 border-t border-vivado-border bg-vivado-panel">
                    <TclConsole projectId={projectId} />
                </div>
            </div>

            {/* Modals */}
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

            <SchematicEditor
                isOpen={showSchematicModal}
                onClose={() => setShowSchematicModal(false)}
                designName="Project Schematic"
            />

            <ArchitectureEditor
                isOpen={showArchitectureModal}
                onClose={() => setShowArchitectureModal(false)}
            />

            <SchematicEditor
                isOpen={showMicroarchitectureModal}
                onClose={() => setShowMicroarchitectureModal(false)}
                designName="Microarchitecture"
                mode="microarchitecture"
            />
        </div>
    );
};
