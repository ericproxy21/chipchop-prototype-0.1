import { useState } from 'react';
import { X, BarChart3, Clock, Zap, AlertCircle, CheckCircle } from 'lucide-react';

interface ReportsModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportType: 'synthesis' | 'implementation' | 'bitstream';
}

const mockReports = {
    synthesis: {
        utilization: { LUT: 45, FF: 32, BRAM: 12, DSP: 8 },
        timing: { wns: 0.234, tns: 0, whs: 0.156, failingPaths: 0 },
        power: { total: 1.234, dynamic: 0.987, static: 0.247 }
    },
    implementation: {
        utilization: { LUT: 47, FF: 33, BRAM: 12, DSP: 8 },
        timing: { wns: 0.156, tns: 0, whs: 0.089, failingPaths: 0 },
        drc: { errors: 0, warnings: 2, criticalWarnings: 0 }
    },
    bitstream: {
        file: 'design.bit',
        size: '2.4 MB',
        config: { voltage: '1.0V', temp: 'Commercial (0°C to 85°C)', speed: '-1' }
    }
};

export const ReportsModal = ({ isOpen, onClose, reportType }: ReportsModalProps) => {
    const [activeTab, setActiveTab] = useState<'utilization' | 'timing' | 'power' | 'drc' | 'config'>('utilization');

    if (!isOpen) return null;

    const UtilizationBar = ({ label, value }: { label: string; value: number }) => (
        <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{label}</span>
                <span className="text-white font-mono">{value}%</span>
            </div>
            <div className="w-full bg-vivado-bg rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${value > 80 ? 'bg-red-500' : value > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );

    const TimingRow = ({ label, value, unit }: { label: string; value: number; unit: string }) => (
        <div className="flex justify-between py-2 border-b border-vivado-border">
            <span className="text-gray-400">{label}</span>
            <span className={`font-mono ${value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {value >= 0 ? '+' : ''}{value.toFixed(3)} {unit}
            </span>
        </div>
    );

    const renderContent = () => {
        if (reportType === 'synthesis' || reportType === 'implementation') {
            const data = reportType === 'synthesis' ? mockReports.synthesis : mockReports.implementation;

            if (activeTab === 'utilization') {
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white mb-4">Resource Utilization</h3>
                        <UtilizationBar label="LUTs (Lookup Tables)" value={data.utilization.LUT} />
                        <UtilizationBar label="Flip-Flops (Registers)" value={data.utilization.FF} />
                        <UtilizationBar label="Block RAM (BRAM)" value={data.utilization.BRAM} />
                        <UtilizationBar label="DSP Slices" value={data.utilization.DSP} />
                    </div>
                );
            }

            if (activeTab === 'timing') {
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white mb-4">Timing Summary</h3>
                        <div className="bg-vivado-bg rounded p-4">
                            <TimingRow label="Worst Negative Slack (WNS)" value={data.timing.wns} unit="ns" />
                            <TimingRow label="Total Negative Slack (TNS)" value={data.timing.tns} unit="ns" />
                            <TimingRow label="Worst Hold Slack (WHS)" value={data.timing.whs} unit="ns" />
                            <div className="flex justify-between py-2">
                                <span className="text-gray-400">Failing Paths</span>
                                <span className={`font-mono ${data.timing.failingPaths === 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {data.timing.failingPaths}
                                </span>
                            </div>
                        </div>
                        {data.timing.wns >= 0 && data.timing.whs >= 0 && (
                            <div className="flex items-center gap-2 text-green-500 bg-green-900/20 p-3 rounded">
                                <CheckCircle size={20} />
                                <span>All timing constraints are met</span>
                            </div>
                        )}
                    </div>
                );
            }

            if (activeTab === 'power' && reportType === 'synthesis') {
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white mb-4">Power Analysis</h3>
                        <div className="bg-vivado-bg rounded p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Power</span>
                                <span className="text-white font-mono">{mockReports.synthesis.power.total} W</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Dynamic Power</span>
                                <span className="text-white font-mono">{mockReports.synthesis.power.dynamic} W</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Static Power</span>
                                <span className="text-white font-mono">{mockReports.synthesis.power.static} W</span>
                            </div>
                        </div>
                    </div>
                );
            }

            if (activeTab === 'drc' && reportType === 'implementation') {
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white mb-4">Design Rule Check (DRC)</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-vivado-bg p-3 rounded">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="text-red-500" size={20} />
                                    <span className="text-gray-400">Errors</span>
                                </div>
                                <span className="text-white font-mono">{mockReports.implementation.drc.errors}</span>
                            </div>
                            <div className="flex items-center justify-between bg-vivado-bg p-3 rounded">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="text-yellow-500" size={20} />
                                    <span className="text-gray-400">Warnings</span>
                                </div>
                                <span className="text-white font-mono">{mockReports.implementation.drc.warnings}</span>
                            </div>
                            <div className="flex items-center justify-between bg-vivado-bg p-3 rounded">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="text-orange-500" size={20} />
                                    <span className="text-gray-400">Critical Warnings</span>
                                </div>
                                <span className="text-white font-mono">{mockReports.implementation.drc.criticalWarnings}</span>
                            </div>
                        </div>
                        {mockReports.implementation.drc.errors === 0 && (
                            <div className="flex items-center gap-2 text-green-500 bg-green-900/20 p-3 rounded">
                                <CheckCircle size={20} />
                                <span>No DRC errors found</span>
                            </div>
                        )}
                    </div>
                );
            }
        }

        if (reportType === 'bitstream') {
            return (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white mb-4">Bitstream Configuration</h3>
                    <div className="bg-vivado-bg rounded p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Output File</span>
                            <span className="text-white font-mono">{mockReports.bitstream.file}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">File Size</span>
                            <span className="text-white font-mono">{mockReports.bitstream.size}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Configuration Voltage</span>
                            <span className="text-white font-mono">{mockReports.bitstream.config.voltage}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Temperature Grade</span>
                            <span className="text-white font-mono">{mockReports.bitstream.config.temp}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Speed Grade</span>
                            <span className="text-white font-mono">{mockReports.bitstream.config.speed}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-green-500 bg-green-900/20 p-3 rounded">
                        <CheckCircle size={20} />
                        <span>Bitstream generated successfully</span>
                    </div>
                </div>
            );
        }
    };

    const getTabs = () => {
        if (reportType === 'synthesis') {
            return ['utilization', 'timing', 'power'];
        } else if (reportType === 'implementation') {
            return ['utilization', 'timing', 'drc'];
        } else {
            return ['config'];
        }
    };

    const getTabIcon = (tab: string) => {
        switch (tab) {
            case 'utilization': return <BarChart3 size={16} />;
            case 'timing': return <Clock size={16} />;
            case 'power': return <Zap size={16} />;
            case 'drc': return <AlertCircle size={16} />;
            default: return null;
        }
    };

    const tabs = getTabs();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-vivado-panel border border-vivado-border rounded-lg w-[700px] max-h-[80vh] flex flex-col shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-vivado-border">
                    <h2 className="text-xl font-bold text-vivado-text capitalize">
                        {reportType} Reports
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {reportType !== 'bitstream' && (
                    <div className="flex border-b border-vivado-border">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 px-4 py-3 text-sm font-medium capitalize flex items-center justify-center gap-2 ${activeTab === tab
                                    ? 'bg-vivado-bg text-vivado-accent border-b-2 border-vivado-accent'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {getTabIcon(tab)}
                                {tab}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
