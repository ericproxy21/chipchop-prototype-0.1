import { useState } from 'react';
import { Layers, Cpu, ChevronRight } from 'lucide-react';
import { SchematicEditor } from './SchematicModal';
import { BlockDiagramEditor } from './BlockDiagramEditor';

interface DesignNavigatorProps {
    projectName: string;
}

export const DesignNavigator = ({ projectName }: DesignNavigatorProps) => {
    const [activeView, setActiveView] = useState<'block' | 'schematic'>('block');
    const [showSchematic, setShowSchematic] = useState(false);
    const [showBlockDiagram, setShowBlockDiagram] = useState(false);

    return (
        <div className="h-full flex flex-col bg-vivado-bg">
            {/* Navigation Tabs */}
            <div className="flex border-b border-vivado-border bg-vivado-panel">
                <button
                    onClick={() => {
                        setActiveView('block');
                        setShowBlockDiagram(true);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeView === 'block'
                        ? 'border-vivado-accent text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                >
                    <Layers size={18} />
                    <span className="font-medium">Block Diagram</span>
                    <span className="text-xs bg-vivado-bg px-2 py-0.5 rounded">System Level</span>
                </button>

                <button
                    onClick={() => {
                        setActiveView('schematic');
                        setShowSchematic(true);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeView === 'schematic'
                        ? 'border-vivado-accent text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                >
                    <Cpu size={18} />
                    <span className="font-medium">Schematic</span>
                    <span className="text-xs bg-vivado-bg px-2 py-0.5 rounded">Gate Level</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6">
                {activeView === 'block' && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="bg-vivado-panel border border-vivado-border rounded-lg p-8 max-w-2xl">
                            <Layers size={48} className="mx-auto mb-4 text-vivado-accent" />
                            <h3 className="text-2xl font-bold text-white mb-2">Block Diagram Editor</h3>
                            <p className="text-gray-400 mb-6">
                                Create system-level architectures by connecting IP blocks like processors, memory controllers,
                                and peripherals using standard bus interfaces (AXI, APB).
                            </p>
                            <button
                                onClick={() => setShowBlockDiagram(true)}
                                className="bg-vivado-accent hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
                            >
                                Open Block Diagram Editor
                                <ChevronRight size={18} />
                            </button>
                            <div className="mt-6 text-sm text-gray-500">
                                <p>Features: IP block library • AXI/APB buses • Top-level wrapper generation</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'schematic' && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="bg-vivado-panel border border-vivado-border rounded-lg p-8 max-w-2xl">
                            <Cpu size={48} className="mx-auto mb-4 text-vivado-accent" />
                            <h3 className="text-2xl font-bold text-white mb-2">Schematic Editor</h3>
                            <p className="text-gray-400 mb-6">
                                Design gate-level circuits visually using logic gates, flip-flops, multiplexers, and other
                                components. Generate RTL code automatically from your schematic.
                            </p>
                            <button
                                onClick={() => setShowSchematic(true)}
                                className="bg-vivado-accent hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
                            >
                                Open Schematic Editor
                                <ChevronRight size={18} />
                            </button>
                            <div className="mt-6 text-sm text-gray-500">
                                <p>Features: Logic gates • Sequential elements • RTL code generation</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Editors */}
            <SchematicEditor
                isOpen={showSchematic}
                onClose={() => setShowSchematic(false)}
                designName={`${projectName}_schematic`}
            />

            <BlockDiagramEditor
                isOpen={showBlockDiagram}
                onClose={() => setShowBlockDiagram(false)}
                designName={`${projectName}_system`}
            />
        </div>
    );
};
