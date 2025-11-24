import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle } from 'lucide-react';

interface RunProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    runType: 'synthesis' | 'implementation' | 'bitstream';
}

const stages = {
    synthesis: [
        { name: 'Parsing design files', duration: 300 },
        { name: 'Analyzing hierarchy', duration: 300 },
        { name: 'Synthesizing logic', duration: 500 },
        { name: 'Optimizing design', duration: 400 },
        { name: 'Generating reports', duration: 300 }
    ],
    implementation: [
        { name: 'Loading design', duration: 300 },
        { name: 'Placing logic', duration: 400 },
        { name: 'Routing nets', duration: 500 },
        { name: 'Optimizing timing', duration: 400 },
        { name: 'Writing checkpoint', duration: 200 }
    ],
    bitstream: [
        { name: 'Loading design checkpoint', duration: 300 },
        { name: 'Configuring bitstream settings', duration: 300 },
        { name: 'Generating bitstream file', duration: 600 },
        { name: 'Writing output files', duration: 300 }
    ]
};

export const RunProgressModal = ({ isOpen, onClose, runType }: RunProgressModalProps) => {
    const [currentStage, setCurrentStage] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const stageList = stages[runType];
    const totalStages = stageList.length;

    useEffect(() => {
        if (!isOpen) {
            setCurrentStage(0);
            setProgress(0);
            setIsComplete(false);
            return;
        }

        let stageIndex = 0;
        let progressValue = 0;

        const runStages = () => {
            if (stageIndex >= totalStages) {
                setIsComplete(true);
                return;
            }

            const stage = stageList[stageIndex];
            const stageProgress = 100 / totalStages;
            const endProgress = progressValue + stageProgress;

            setCurrentStage(stageIndex);

            const interval = setInterval(() => {
                progressValue += stageProgress / (stage.duration / 50);
                if (progressValue >= endProgress) {
                    progressValue = endProgress;
                    clearInterval(interval);
                    stageIndex++;
                    setTimeout(runStages, 100);
                }
                setProgress(Math.min(progressValue, 100));
            }, 50);
        };

        runStages();
    }, [isOpen, runType]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-vivado-panel border border-vivado-border rounded-lg w-[600px] p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-vivado-text capitalize flex items-center gap-2">
                        <Play className="text-vivado-accent" size={20} />
                        Running {runType === 'bitstream' ? 'Bitstream Generation' : runType}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                        disabled={!isComplete}
                    >
                        <X size={20} />
                    </button>
                </div>

                {isComplete ? (
                    <div className="text-center py-8">
                        <CheckCircle className="mx-auto text-vivado-accent mb-4" size={48} />
                        <h3 className="text-lg font-bold mb-2 text-white">
                            {runType === 'synthesis' ? 'Synthesis' : runType === 'implementation' ? 'Implementation' : 'Bitstream Generation'} Complete!
                        </h3>
                        <p className="text-gray-400 mb-6">
                            All stages completed successfully. Check the Reports viewer for detailed results.
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-vivado-accent hover:bg-blue-600 text-white px-6 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Progress Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Overall Progress</span>
                                <span className="text-white font-mono">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                                <div
                                    className="h-3 rounded-full bg-vivado-accent transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Stage List */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-gray-400 mb-3">Stages:</h3>
                            {stageList.map((stage, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-3 p-2 rounded ${idx === currentStage ? 'bg-vivado-accent/10 border border-vivado-accent' :
                                            idx < currentStage ? 'bg-gray-700/50' : 'bg-vivado-bg'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx < currentStage ? 'bg-vivado-accent text-white' :
                                            idx === currentStage ? 'bg-vivado-accent text-white animate-pulse' :
                                                'bg-gray-600 text-gray-400'
                                        }`}>
                                        {idx < currentStage ? '✓' : idx + 1}
                                    </div>
                                    <span className={`text-sm ${idx === currentStage ? 'text-white font-medium' :
                                            idx < currentStage ? 'text-gray-300' :
                                                'text-gray-500'
                                        }`}>
                                        {stage.name}
                                    </span>
                                    {idx === currentStage && (
                                        <div className="ml-auto">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-vivado-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-vivado-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-vivado-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
