import { useState } from 'react';
import { X, Cpu } from 'lucide-react';

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description: string; architecture: string }) => void;
    projectType: 'blank' | 'template';
}

const ARCHITECTURES = [
    { value: 'zynq-7000', label: 'Zynq-7000 SoC' },
    { value: 'zynq-ultrascale', label: 'Zynq UltraScale+ MPSoC' },
    { value: 'artix-7', label: 'Artix-7 FPGA' },
    { value: 'kintex-7', label: 'Kintex-7 FPGA' },
    { value: 'virtex-7', label: 'Virtex-7 FPGA' },
    { value: 'spartan-7', label: 'Spartan-7 FPGA' },
    { value: 'kintex-ultrascale', label: 'Kintex UltraScale FPGA' },
    { value: 'virtex-ultrascale', label: 'Virtex UltraScale FPGA' },
];

export const NewProjectModal = ({ isOpen, onClose, onSubmit, projectType }: NewProjectModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [architecture, setArchitecture] = useState('zynq-7000');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, description, architecture });
        // Reset form
        setName('');
        setDescription('');
        setArchitecture('zynq-7000');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-vivado-panel border border-vivado-border rounded-lg w-full max-w-lg p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Cpu size={24} className="text-vivado-accent" />
                        {projectType === 'blank' ? 'New Project' : 'New Template Project'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Project Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="my_fpga_project"
                                className="w-full bg-vivado-bg border border-vivado-border rounded-lg p-3 text-white focus:outline-none focus:border-vivado-accent transition-colors"
                                required
                                autoFocus
                            />
                        </div>

                        {/* Architecture Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">
                                Target Architecture *
                            </label>
                            <select
                                value={architecture}
                                onChange={(e) => setArchitecture(e.target.value)}
                                className="w-full bg-vivado-bg border border-vivado-border rounded-lg p-3 text-white focus:outline-none focus:border-vivado-accent transition-colors"
                                required
                            >
                                {ARCHITECTURES.map((arch) => (
                                    <option key={arch.value} value={arch.value}>
                                        {arch.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                Select the target FPGA/SoC architecture for your project
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">
                                Description (Optional)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter a brief description of your project..."
                                className="w-full bg-vivado-bg border border-vivado-border rounded-lg p-3 text-white focus:outline-none focus:border-vivado-accent transition-colors resize-none"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg hover:bg-vivado-border transition-colors text-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-vivado-accent hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
