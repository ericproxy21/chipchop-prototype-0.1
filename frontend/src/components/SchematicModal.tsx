import { useState, useCallback, useMemo, useEffect } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
    Handle,
    Position,
    type Node,
    type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { X, Save, Download, Code, Plus, Trash2 } from 'lucide-react';
import type { ComponentType, SchematicDesign } from '../types/design';
import { getComponentDefinition } from './SchematicComponents';
import { generateVerilogFromSchematic } from '../utils/SchematicCodeGen';
import { MICROARCHITECTURE_COMPONENTS } from './MicroarchitectureComponents';
import { LOGIC_GATES, SEQUENTIAL_ELEMENTS, ARITHMETIC_COMPONENTS, MULTIPLEXERS, IO_COMPONENTS } from './SchematicComponents';

interface SchematicEditorProps {
    isOpen: boolean;
    onClose: () => void;
    designName?: string;
    onSave?: (design: SchematicDesign) => void;
    mode?: 'schematic' | 'microarchitecture';
    projectId?: string;
}

// Custom node component for schematic components
const SchematicNode = ({ data }: { data: any }) => {
    const { type, label } = data;

    return (
        <div className="bg-gray-700 border-2 border-blue-400 rounded px-4 py-2 min-w-[80px] text-center relative">
            <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-blue-400" />
            <div className="text-xs text-gray-400 mb-1">{type}</div>
            <div className="text-white font-semibold text-sm">{label}</div>
            <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-blue-400" />
        </div>
    );
};

// Custom node for Microarchitecture components with specific shapes and ports
const MicroarchNode = ({ data }: { data: any }) => {
    const { type, label, ports = [] } = data;

    // Helper to get shape classes based on type
    const getShapeClasses = () => {
        if (type === 'CPU_ALU') {
            return 'clip-path-trapezoid bg-purple-900/50 border-purple-500';
        }
        if (type === 'CPU_MUX') {
            return 'clip-path-trapezoid bg-blue-900/50 border-blue-500';
        }
        if (type === 'CPU_REGISTER_FILE') {
            return 'bg-green-900/50 border-green-500 rounded-lg';
        }
        if (type === 'CPU_CONTROL_UNIT') {
            return 'bg-red-900/50 border-red-500 rounded-full';
        }
        return 'bg-gray-800 border-gray-500 rounded';
    };

    // Render ALU Shape (Trapezoid)
    if (type === 'CPU_ALU') {
        return (
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* SVG Trapezoid for ALU */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100">
                    <path d="M 0 0 L 100 20 L 100 80 L 0 100 Z" fill="#581c87" stroke="#a855f7" strokeWidth="2" />
                    <text x="50" y="50" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">ALU</text>
                </svg>

                {/* Ports */}
                {ports.map((port: any, index: number) => {
                    const isInput = port.type === 'input';
                    // Custom positioning for ALU ports
                    let top = 0;
                    if (port.name === 'a') top = 20;
                    if (port.name === 'b') top = 80;
                    if (port.name === 'result') top = 50;
                    if (port.name === 'zero') top = 70;
                    if (port.name === 'op') top = 10; // Control signal usually on top/bottom, putting on side for now or top

                    // Adjust for side
                    const style: React.CSSProperties = {
                        position: 'absolute',
                        top: `${top}%`,
                        [isInput ? 'left' : 'right']: -4,
                    };

                    // Special case for 'op' if we want it on top
                    if (port.name === 'op') {
                        style.top = '10%';
                        style.left = '50%';
                    }

                    return (
                        <div key={port.name} style={style} className="flex items-center absolute w-full h-full pointer-events-none">
                            <Handle
                                id={port.name}
                                type={isInput ? 'target' : 'source'}
                                position={isInput ? Position.Left : Position.Right}
                                className={`w-2 h-2 !bg-gray-200 pointer-events-auto ${port.name === 'op' ? '!top-0 !left-1/2 -translate-x-1/2' : ''}`}
                            />
                            <span className={`absolute text-[8px] text-gray-300 ${isInput ? 'left-3' : 'right-3'}`}>
                                {port.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Default Rectangular Node with named ports
    return (
        <div className={`border-2 px-4 py-4 min-w-[120px] min-h-[80px] relative flex flex-col justify-center items-center ${getShapeClasses()}`}>
            <div className="text-white font-bold text-sm mb-2">{label}</div>

            {/* Render Ports */}
            {ports.map((port: any, index: number) => {
                const isInput = port.type === 'input';
                // Distribute ports evenly
                const inputPorts = ports.filter((p: any) => p.type === 'input');
                const outputPorts = ports.filter((p: any) => p.type === 'output');

                const portIndex = isInput
                    ? inputPorts.findIndex((p: any) => p.name === port.name)
                    : outputPorts.findIndex((p: any) => p.name === port.name);

                const totalSidePorts = isInput ? inputPorts.length : outputPorts.length;
                const topPos = ((portIndex + 1) / (totalSidePorts + 1)) * 100;

                return (
                    <div
                        key={port.name}
                        className="absolute w-full"
                        style={{ top: `${topPos}%`, left: 0, pointerEvents: 'none' }}
                    >
                        <Handle
                            id={port.name}
                            type={isInput ? 'target' : 'source'}
                            position={isInput ? Position.Left : Position.Right}
                            className={`w-2 h-2 !bg-gray-200 pointer-events-auto ${isInput ? '-ml-1' : '-mr-1'}`}
                            style={{ [isInput ? 'left' : 'right']: 0 }}
                        />
                        <span
                            className={`absolute text-[10px] text-gray-300 ${isInput ? 'left-2' : 'right-2'}`}
                            style={{ [isInput ? 'left' : 'right']: '8px', transform: 'translateY(-50%)' }}
                        >
                            {port.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const nodeTypes = {
    schematicComponent: SchematicNode,
    microarchComponent: MicroarchNode,
};

export const SchematicEditor = ({ isOpen, onClose, designName = 'untitled', onSave, mode = 'schematic', projectId }: SchematicEditorProps) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(mode === 'microarchitecture' ? 'cpu_core' : 'logic');
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');

    // Fetch data on mount
    useEffect(() => {
        if (isOpen && projectId && mode === 'microarchitecture') {
            fetchMicroarchitecture();
        }
    }, [isOpen, projectId, mode]);

    const fetchMicroarchitecture = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/projects/${projectId}/files/microarchitecture.json`);
            if (response.ok) {
                const data = await response.json();
                if (data.content) {
                    try {
                        const design = JSON.parse(data.content);
                        // Convert design format to React Flow nodes/edges
                        const flowNodes = design.components.map((comp: any) => ({
                            id: comp.id,
                            type: mode === 'microarchitecture' ? 'microarchComponent' : 'schematicComponent',
                            position: comp.position,
                            data: {
                                type: comp.type,
                                label: comp.label || comp.type,
                                ports: comp.ports || [],
                                properties: comp.properties
                            }
                        }));

                        // Convert wires to edges if any (assuming simple format for now)
                        const flowEdges = (design.wires || []).map((wire: any) => ({
                            id: wire.id,
                            source: wire.source,
                            target: wire.target,
                            type: 'default',
                            animated: true,
                            style: { stroke: '#60a5fa', strokeWidth: 2 }
                        }));

                        setNodes(flowNodes);
                        setEdges(flowEdges);
                    } catch (e) {
                        console.error('Failed to parse microarchitecture JSON', e);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch microarchitecture', error);
        }
    };

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#60a5fa', strokeWidth: 2 } }, eds)),
        [setEdges]
    );

    const availableComponents = useMemo(() => {
        if (mode === 'microarchitecture') {
            return MICROARCHITECTURE_COMPONENTS;
        }
        return [
            ...LOGIC_GATES,
            ...SEQUENTIAL_ELEMENTS,
            ...ARITHMETIC_COMPONENTS,
            ...MULTIPLEXERS,
            ...IO_COMPONENTS,
        ];
    }, [mode]);

    const categories = useMemo(() => {
        const cats = new Set(availableComponents.map(c => c.category));
        return Array.from(cats);
    }, [availableComponents]);

    const filteredComponents = useMemo(() => {
        return availableComponents.filter(c => c.category === selectedCategory);
    }, [selectedCategory, availableComponents]);

    const addComponent = useCallback((componentType: ComponentType) => {
        const definition = mode === 'microarchitecture'
            ? MICROARCHITECTURE_COMPONENTS.find(c => c.type === componentType)
            : getComponentDefinition(componentType);

        if (!definition) return;

        const newNode: Node = {
            id: `${componentType}-${Date.now()}`,
            type: mode === 'microarchitecture' ? 'microarchComponent' : 'schematicComponent',
            position: { x: 250, y: 100 + nodes.length * 80 },
            data: {
                type: componentType,
                label: definition.label,
                ports: definition.defaultPorts || [], // Ensure ports are passed
            },
        };

        setNodes((nds) => [...nds, newNode]);
    }, [nodes.length, setNodes, mode]);

    const clearCanvas = useCallback(() => {
        if (confirm('Clear all components? This cannot be undone.')) {
            setNodes([]);
            setEdges([]);
        }
    }, [setNodes, setEdges]);

    const handleGenerateCode = useCallback(() => {
        // Convert React Flow nodes/edges to SchematicDesign format
        const design: SchematicDesign = {
            id: Date.now().toString(),
            name: designName,
            components: nodes.map(node => ({
                id: node.id,
                type: node.data.type as ComponentType,
                label: node.data.label as string,
                position: node.position,
                ports: (node.data.ports || []) as any[],
                properties: node.data.properties as any,
            })),
            wires: edges.map(edge => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                label: edge.label as string,
            })),
            metadata: {
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
            },
        };

        const result = generateVerilogFromSchematic(design, {
            language: 'verilog',
            includeComments: true,
            includeTestbench: false,
        });

        setGeneratedCode(result.module);
        setShowCodeModal(true);
    }, [nodes, edges, designName]);

    const handleSave = useCallback(async () => {
        const design: SchematicDesign = {
            id: Date.now().toString(),
            name: designName,
            components: nodes.map(node => ({
                id: node.id,
                type: node.data.type as ComponentType,
                label: node.data.label as string,
                position: node.position,
                ports: (node.data.ports || []) as any[],
                properties: node.data.properties as any,
            })),
            wires: edges.map(edge => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                label: edge.label as string,
            })),
            metadata: {
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
            },
        };

        if (onSave) {
            onSave(design);
        }

        if (projectId && mode === 'microarchitecture') {
            try {
                const response = await fetch(`http://localhost:8000/api/projects/${projectId}/files/microarchitecture.json`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: JSON.stringify(design, null, 2) }),
                });

                if (response.ok) {
                    alert('Microarchitecture saved successfully!');
                } else {
                    alert('Failed to save microarchitecture.');
                }
            } catch (error) {
                console.error('Failed to save microarchitecture', error);
                alert('Failed to save microarchitecture.');
            }
        } else {
            // Also save to localStorage
            localStorage.setItem(`schematic_${designName}`, JSON.stringify(design));
            alert('Schematic saved successfully (local)!');
        }
    }, [nodes, edges, designName, onSave, projectId, mode]);

    const downloadCode = useCallback(() => {
        const blob = new Blob([generatedCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${designName}.v`;
        a.click();
        URL.revokeObjectURL(url);
    }, [generatedCode, designName]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-vivado-panel border border-vivado-border rounded-lg w-[95vw] h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-vivado-border">
                    <h2 className="text-xl font-bold text-vivado-text">
                        {mode === 'microarchitecture' ? 'Microarchitecture Editor' : 'Schematic Editor'} - {designName}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-white text-sm flex items-center gap-1"
                            title="Save Schematic"
                        >
                            <Save size={16} /> Save
                        </button>
                        <button
                            onClick={handleGenerateCode}
                            className="px-3 py-1.5 bg-vivado-accent hover:bg-blue-600 rounded text-white text-sm flex items-center gap-1"
                            title="Generate RTL Code"
                        >
                            <Code size={16} /> Generate RTL
                        </button>
                        <button
                            onClick={clearCanvas}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-white text-sm flex items-center gap-1"
                            title="Clear Canvas"
                        >
                            <Trash2 size={16} /> Clear
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-vivado-border rounded text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Component Palette */}
                    <div className="w-64 border-r border-vivado-border bg-vivado-bg p-4 overflow-y-auto">
                        <h3 className="text-sm font-bold text-gray-300 mb-3">Component Library</h3>

                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-1 mb-4">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-2 py-1 text-xs rounded ${selectedCategory === cat
                                        ? 'bg-vivado-accent text-white'
                                        : 'bg-vivado-panel text-gray-400 hover:bg-vivado-border'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Component List */}
                        <div className="space-y-2">
                            {filteredComponents.map(comp => (
                                <button
                                    key={comp.type}
                                    onClick={() => addComponent(comp.type)}
                                    className="w-full text-left px-3 py-2 bg-vivado-panel border border-vivado-border rounded hover:border-vivado-accent transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-white">{comp.label}</div>
                                            <div className="text-xs text-gray-400">{comp.type}</div>
                                        </div>
                                        <Plus size={16} className="text-gray-400 group-hover:text-vivado-accent" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 bg-gray-900">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            fitView
                        >
                            <Background color="#2a2a2a" gap={20} />
                            <Controls />
                            <MiniMap
                                nodeColor="#374151"
                                maskColor="rgba(0, 0, 0, 0.6)"
                                className="bg-vivado-panel border border-vivado-border"
                            />
                            <Panel position="top-right" className="bg-vivado-panel border border-vivado-border rounded p-2 text-xs text-gray-400">
                                <div>Components: {nodes.length}</div>
                                <div>Connections: {edges.length}</div>
                            </Panel>
                        </ReactFlow>
                    </div>
                </div>

                {/* Code Modal */}
                {showCodeModal && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                        <div className="bg-vivado-panel border border-vivado-border rounded-lg w-[80%] h-[80%] flex flex-col">
                            <div className="flex justify-between items-center p-4 border-b border-vivado-border">
                                <h3 className="text-lg font-bold text-white">Generated Verilog Code</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={downloadCode}
                                        className="px-3 py-1.5 bg-vivado-accent hover:bg-blue-600 rounded text-white text-sm flex items-center gap-1"
                                    >
                                        <Download size={16} /> Download
                                    </button>
                                    <button
                                        onClick={() => setShowCodeModal(false)}
                                        className="p-2 hover:bg-vivado-border rounded text-gray-400 hover:text-white"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto p-4">
                                <pre className="text-sm text-gray-300 font-mono bg-gray-900 p-4 rounded">
                                    {generatedCode}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
