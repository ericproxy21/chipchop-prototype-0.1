import { useState } from 'react';
import { Sparkles, X, ArrowRight, SkipForward } from 'lucide-react';

interface ScaffoldModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (specs: string) => void;
    onSkip: () => void;
}

export const ScaffoldModal = ({ isOpen, onClose, onConfirm, onSkip }: ScaffoldModalProps) => {
    const [specs, setSpecs] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] backdrop-blur-sm">
            <div className="bg-vivado-panel border border-vivado-border rounded-lg w-[600px] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-vivado-border bg-gradient-to-r from-vivado-panel to-blue-900/20">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="text-yellow-400" size={24} />
                            AI Project Scaffolding
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Kickstart your project with ChipChop AI</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-300 text-lg">
                        Do you want Chipchop AI to scaffold your project for you?
                    </p>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-400">
                            Describe the architecture specifications you're looking for:
                        </label>
                        <textarea
                            value={specs}
                            onChange={(e) => setSpecs(e.target.value)}
                            className="w-full h-32 bg-vivado-bg border border-vivado-border rounded p-3 text-gray-200 focus:outline-none focus:border-vivado-accent focus:ring-1 focus:ring-vivado-accent transition-all resize-none placeholder-gray-600"
                            placeholder="E.g., A 32-bit RISC-V processor with 5-stage pipeline, 4KB instruction cache, and UART interface..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-vivado-border flex justify-between items-center bg-vivado-bg/50">
                    <button
                        onClick={onSkip}
                        className="px-4 py-2 text-gray-400 hover:text-white hover:bg-vivado-border rounded transition-colors flex items-center gap-2"
                    >
                        <SkipForward size={16} />
                        No, create empty project
                    </button>
                    <button
                        onClick={() => onConfirm(specs)}
                        className="px-6 py-2 bg-gradient-to-r from-vivado-accent to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded font-medium shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all transform hover:scale-105"
                    >
                        <Sparkles size={16} />
                        Scaffold Project
                    </button>
                </div>
            </div>
        </div>
    );
};
