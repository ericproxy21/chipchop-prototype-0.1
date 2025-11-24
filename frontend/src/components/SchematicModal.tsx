import React from 'react';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface SchematicModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SchematicModal = ({ isOpen, onClose }: SchematicModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-vivado-panel border border-vivado-border rounded-lg w-[90vw] h-[85vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-vivado-border">
                    <h2 className="text-xl font-bold text-vivado-text">Schematic Viewer - top.v</h2>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-vivado-border rounded text-gray-400 hover:text-white" title="Zoom In">
                            <ZoomIn size={18} />
                        </button>
                        <button className="p-2 hover:bg-vivado-border rounded text-gray-400 hover:text-white" title="Zoom Out">
                            <ZoomOut size={18} />
                        </button>
                        <button className="p-2 hover:bg-vivado-border rounded text-gray-400 hover:text-white" title="Fit to Window">
                            <Maximize2 size={18} />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-vivado-border rounded text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Schematic Canvas */}
                <div className="flex-1 bg-gray-900 relative overflow-hidden">
                    {/* Grid Background */}
                    <svg className="absolute inset-0 w-full h-full">
                        <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2a2a2a" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>

                    {/* Schematic Content */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
                        {/* Input Ports */}
                        <g id="inputs">
                            <rect x="50" y="100" width="80" height="30" fill="#1e40af" stroke="#3b82f6" strokeWidth="2" rx="4" />
                            <text x="90" y="120" fill="white" fontSize="12" textAnchor="middle">clk</text>

                            <rect x="50" y="180" width="80" height="30" fill="#1e40af" stroke="#3b82f6" strokeWidth="2" rx="4" />
                            <text x="90" y="200" fill="white" fontSize="12" textAnchor="middle">reset</text>

                            <rect x="50" y="260" width="80" height="30" fill="#1e40af" stroke="#3b82f6" strokeWidth="2" rx="4" />
                            <text x="90" y="280" fill="white" fontSize="12" textAnchor="middle">data_in[7:0]</text>
                        </g>

                        {/* Logic Gates */}
                        <g id="gates">
                            {/* AND Gate */}
                            <path d="M 200 100 L 200 140 Q 240 140 240 120 Q 240 100 200 100 Z"
                                fill="#374151" stroke="#60a5fa" strokeWidth="2" />
                            <text x="215" y="125" fill="white" fontSize="10" textAnchor="middle">AND</text>

                            {/* OR Gate */}
                            <path d="M 200 180 L 200 220 Q 240 220 240 200 Q 240 180 200 180 Z"
                                fill="#374151" stroke="#60a5fa" strokeWidth="2" />
                            <text x="215" y="205" fill="white" fontSize="10" textAnchor="middle">OR</text>

                            {/* Flip-Flop */}
                            <rect x="200" y="260" width="60" height="50" fill="#374151" stroke="#60a5fa" strokeWidth="2" rx="4" />
                            <text x="230" y="280" fill="white" fontSize="10" textAnchor="middle">DFF</text>
                            <text x="230" y="295" fill="#9ca3af" fontSize="8" textAnchor="middle">Q</text>
                            <circle cx="205" cy="305" r="2" fill="#60a5fa" />
                            <text x="210" y="308" fill="#9ca3af" fontSize="7">CLK</text>
                        </g>

                        {/* Intermediate Logic */}
                        <g id="intermediate">
                            {/* MUX */}
                            <polygon points="320,150 320,230 380,210 380,170"
                                fill="#374151" stroke="#60a5fa" strokeWidth="2" />
                            <text x="350" y="195" fill="white" fontSize="10" textAnchor="middle">MUX</text>
                            <text x="340" y="215" fill="#9ca3af" fontSize="8">SEL</text>

                            {/* Adder */}
                            <rect x="320" y="260" width="60" height="50" fill="#374151" stroke="#60a5fa" strokeWidth="2" rx="4" />
                            <text x="350" y="285" fill="white" fontSize="10" textAnchor="middle">ADD</text>
                            <text x="350" y="300" fill="#9ca3af" fontSize="8" textAnchor="middle">8-bit</text>
                        </g>

                        {/* Output Ports */}
                        <g id="outputs">
                            <rect x="500" y="180" width="80" height="30" fill="#1e40af" stroke="#3b82f6" strokeWidth="2" rx="4" />
                            <text x="540" y="200" fill="white" fontSize="12" textAnchor="middle">data_out[7:0]</text>

                            <rect x="500" y="270" width="80" height="30" fill="#1e40af" stroke="#3b82f6" strokeWidth="2" rx="4" />
                            <text x="540" y="290" fill="white" fontSize="12" textAnchor="middle">valid</text>
                        </g>

                        {/* Connections */}
                        <g id="wires" stroke="#60a5fa" strokeWidth="1.5" fill="none">
                            {/* clk to AND */}
                            <path d="M 130 115 L 200 115" />

                            {/* reset to OR */}
                            <path d="M 130 195 L 200 195" />

                            {/* data_in to DFF */}
                            <path d="M 130 275 L 200 275" />

                            {/* AND to MUX */}
                            <path d="M 240 120 L 280 120 L 280 170 L 320 170" />

                            {/* OR to MUX */}
                            <path d="M 240 200 L 280 200 L 280 210 L 320 210" />

                            {/* DFF to Adder */}
                            <path d="M 260 285 L 320 285" />

                            {/* MUX to output */}
                            <path d="M 380 190 L 440 190 L 440 195 L 500 195" />

                            {/* Adder to output */}
                            <path d="M 380 285 L 500 285" />

                            {/* Clock line to DFF */}
                            <path d="M 130 115 L 160 115 L 160 305 L 200 305" strokeDasharray="3,3" />
                        </g>

                        {/* Signal Labels */}
                        <g id="labels" fill="#9ca3af" fontSize="9">
                            <text x="150" y="110">clk</text>
                            <text x="150" y="190">rst</text>
                            <text x="145" y="270">din[7:0]</text>
                            <text x="270" y="115">ctrl_a</text>
                            <text x="270" y="195">ctrl_b</text>
                            <text x="420" y="185">dout[7:0]</text>
                            <text x="430" y="280">valid</text>
                        </g>

                        {/* Bus Width Indicators */}
                        <g id="bus-width" fill="#fbbf24" fontSize="8">
                            <text x="140" y="268">[8]</text>
                            <text x="280" y="273">[8]</text>
                            <text x="440" y="188">[8]</text>
                        </g>
                    </svg>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-vivado-panel border border-vivado-border rounded p-3 text-xs">
                        <div className="font-bold text-gray-300 mb-2">Legend</div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-900 border border-blue-500 rounded"></div>
                                <span className="text-gray-400">I/O Ports</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-700 border border-blue-400 rounded"></div>
                                <span className="text-gray-400">Logic Gates</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-blue-400"></div>
                                <span className="text-gray-400">Connections</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-blue-400" style={{ borderTop: '1px dashed' }}></div>
                                <span className="text-gray-400">Clock</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="absolute top-4 right-4 bg-vivado-panel border border-vivado-border rounded p-3 text-xs max-w-xs">
                        <div className="font-bold text-gray-300 mb-2">Design Statistics</div>
                        <div className="space-y-1 text-gray-400">
                            <div className="flex justify-between">
                                <span>Total Gates:</span>
                                <span className="text-white">47</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Flip-Flops:</span>
                                <span className="text-white">12</span>
                            </div>
                            <div className="flex justify-between">
                                <span>I/O Ports:</span>
                                <span className="text-white">5</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Nets:</span>
                                <span className="text-white">34</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-vivado-border bg-vivado-bg text-xs text-gray-400 flex justify-between">
                    <span>Zoom: 100% | Grid: 20px</span>
                    <span>Elaborated Design View</span>
                </div>
            </div>
        </div>
    );
};
