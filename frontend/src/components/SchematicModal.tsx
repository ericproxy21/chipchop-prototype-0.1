import { useState, useCallback, useMemo } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
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
}

// Custom node component for schematic components
const SchematicNode = ({ data }: { data: any }) => {
    const { type, label } = data;

    return (
        <div className="bg-gray-700 border-2 border-blue-400 rounded px-4 py-2 min-w-[80px] text-center">
            <div className="text-xs text-gray-400 mb-1">{type}</div>
            <div className="text-white font-semibold text-sm">{label}</div>
        </div>
    );
};

const nodeTypes = {
    schematicComponent: SchematicNode,
};

export const SchematicEditor = ({ isOpen, onClose, designName = 'untitled', onSave, mode = 'schematic' }: SchematicEditorProps) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(mode === 'microarchitecture' ? 'cpu_core' : 'logic');
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
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
        const definition = getComponentDefinition(componentType);
        if (!definition) return;

        const newNode: Node = {
            id: `${componentType}-${Date.now()}`,
            type: 'schematicComponent',
            position: { x: 250, y: 100 + nodes.length * 80 },
            data: {
                type: componentType,
                label: definition.label,
                ports: definition.defaultPorts,
            },
        };

        setNodes((nds) => [...nds, newNode]);
    }, [nodes.length, setNodes]);

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

    const handleSave = useCallback(() => {
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

        // Also save to localStorage
        localStorage.setItem(`schematic_${designName}`, JSON.stringify(design));
        alert('Schematic saved successfully!');
    }, [nodes, edges, designName, onSave]);

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
                    <h2 className="text-xl font-bold text-vivado-text">Schematic Editor - {designName}</h2>
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
