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
import { X, Save, Download, Code, Plus, Trash2, Settings } from 'lucide-react';
import type { BlockType, BlockDiagram } from '../types/design';
import { ALL_BLOCKS, getBlockDefinition } from './BlockComponents';
import { generateWrapperFromBlockDiagram, generateConstraints } from '../utils/BlockCodeGen';

interface BlockDiagramEditorProps {
    isOpen: boolean;
    onClose: () => void;
    designName?: string;
    onSave?: (design: BlockDiagram) => void;
}

// Custom node component for IP blocks
const IPBlockNode = ({ data }: { data: any }) => {
    const { type, name, category } = data;

    const categoryColors: Record<string, string> = {
        processor: 'border-purple-500 bg-purple-900/30',
        memory: 'border-green-500 bg-green-900/30',
        peripheral: 'border-yellow-500 bg-yellow-900/30',
        interconnect: 'border-blue-500 bg-blue-900/30',
        clock: 'border-red-500 bg-red-900/30',
        custom: 'border-gray-500 bg-gray-900/30',
    };

    const colorClass = categoryColors[category] || 'border-gray-500 bg-gray-900/30';

    return (
        <div className={`border-2 rounded-lg px-6 py-4 min-w-[140px] ${colorClass}`}>
            <div className="text-xs text-gray-400 mb-1 uppercase">{category}</div>
            <div className="text-white font-bold text-sm mb-1">{name}</div>
            <div className="text-xs text-gray-500">{type}</div>
        </div>
    );
};

const nodeTypes = {
    ipBlock: IPBlockNode,
};

export const BlockDiagramEditor = ({ isOpen, onClose, designName = 'system', onSave }: BlockDiagramEditorProps) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('processor');
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [codeType, setCodeType] = useState<'wrapper' | 'constraints'>('wrapper');

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        [setEdges]
    );

    const categories = useMemo(() => {
        const cats = new Set(ALL_BLOCKS.map(b => b.category));
        return Array.from(cats);
    }, []);

    const filteredBlocks = useMemo(() => {
        return ALL_BLOCKS.filter(b => b.category === selectedCategory);
    }, [selectedCategory]);

    const addBlock = useCallback((blockType: BlockType) => {
        const definition = getBlockDefinition(blockType);
        if (!definition) return;

        const newNode: Node = {
            id: `${blockType}-${Date.now()}`,
            type: 'ipBlock',
            position: { x: 300, y: 100 + nodes.length * 120 },
            data: {
                type: blockType,
                name: definition.label,
                category: definition.category,
                interfaces: definition.defaultInterfaces,
            },
        };

        setNodes((nds) => [...nds, newNode]);
    }, [nodes.length, setNodes]);

    const clearCanvas = useCallback(() => {
        if (confirm('Clear all blocks? This cannot be undone.')) {
            setNodes([]);
            setEdges([]);
        }
    }, [setNodes, setEdges]);

    const handleGenerateCode = useCallback((type: 'wrapper' | 'constraints') => {
        const diagram: BlockDiagram = {
            id: Date.now().toString(),
            name: designName,
            blocks: nodes.map(node => ({
                id: node.id,
                type: node.data.type as BlockType,
                name: node.data.name as string,
                position: node.position,
                interfaces: (node.data.interfaces || []) as any[],
                properties: node.data.properties as any,
            })),
            connections: edges.map(edge => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: 'AXI4_LITE',
            })),
            metadata: {
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
            },
        };

        let code = '';
        if (type === 'wrapper') {
            code = generateWrapperFromBlockDiagram(diagram, {
                language: 'verilog',
                includeComments: true,
                includeTestbench: false,
            });
        } else {
            code = generateConstraints(diagram);
        }

        setGeneratedCode(code);
        setCodeType(type);
        setShowCodeModal(true);
    }, [nodes, edges, designName]);

    const handleSave = useCallback(() => {
        const diagram: BlockDiagram = {
            id: Date.now().toString(),
            name: designName,
            blocks: nodes.map(node => ({
                id: node.id,
                type: node.data.type as BlockType,
                name: node.data.name as string,
                position: node.position,
                interfaces: (node.data.interfaces || []) as any[],
                properties: node.data.properties as any,
            })),
            connections: edges.map(edge => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: 'AXI4_LITE',
            })),
            metadata: {
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
            },
        };

        if (onSave) {
            onSave(diagram);
        }

        localStorage.setItem(`blockdiagram_${designName}`, JSON.stringify(diagram));
        alert('Block diagram saved successfully!');
    }, [nodes, edges, designName, onSave]);

    const downloadCode = useCallback(() => {
        const extension = codeType === 'wrapper' ? 'v' : 'xdc';
        const blob = new Blob([generatedCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${designName}_top.${extension}`;
        a.click();
        URL.revokeObjectURL(url);
    }, [generatedCode, designName, codeType]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-vivado-panel border border-vivado-border rounded-lg w-[95vw] h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-vivado-border">
                    <h2 className="text-xl font-bold text-vivado-text">Block Diagram Editor - {designName}</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-white text-sm flex items-center gap-1"
                            title="Save Block Diagram"
                        >
                            <Save size={16} /> Save
                        </button>
                        <button
                            onClick={() => handleGenerateCode('wrapper')}
                            className="px-3 py-1.5 bg-vivado-accent hover:bg-blue-600 rounded text-white text-sm flex items-center gap-1"
                            title="Generate Wrapper"
                        >
                            <Code size={16} /> Wrapper
                        </button>
                        <button
                            onClick={() => handleGenerateCode('constraints')}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm flex items-center gap-1"
                            title="Generate Constraints"
                        >
                            <Settings size={16} /> XDC
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
                    {/* IP Block Library */}
                    <div className="w-64 border-r border-vivado-border bg-vivado-bg p-4 overflow-y-auto">
                        <h3 className="text-sm font-bold text-gray-300 mb-3">IP Block Library</h3>

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

                        {/* Block List */}
                        <div className="space-y-2">
                            {filteredBlocks.map(block => (
                                <button
                                    key={block.type}
                                    onClick={() => addBlock(block.type)}
                                    className="w-full text-left px-3 py-2 bg-vivado-panel border border-vivado-border rounded hover:border-vivado-accent transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-white">{block.label}</div>
                                            <div className="text-xs text-gray-400">{block.type}</div>
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
                                nodeColor={(node) => {
                                    const colors: Record<string, string> = {
                                        processor: '#9333ea',
                                        memory: '#22c55e',
                                        peripheral: '#eab308',
                                        interconnect: '#3b82f6',
                                        clock: '#ef4444',
                                        custom: '#6b7280',
                                    };
                                    return colors[node.data?.category as string] || '#6b7280';
                                }}
                                maskColor="rgba(0, 0, 0, 0.6)"
                                className="bg-vivado-panel border border-vivado-border"
                            />
                            <Panel position="top-right" className="bg-vivado-panel border border-vivado-border rounded p-2 text-xs text-gray-400">
                                <div>IP Blocks: {nodes.length}</div>
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
                                <h3 className="text-lg font-bold text-white">
                                    Generated {codeType === 'wrapper' ? 'Verilog Wrapper' : 'XDC Constraints'}
                                </h3>
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
