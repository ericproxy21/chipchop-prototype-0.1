import React from 'react';
import { Play, Settings, Layers, Cpu, Activity, Database, Cloud } from 'lucide-react';

interface FlowNavigatorProps {
    onCloudConnect?: () => void;
}

export const FlowNavigator = ({ onCloudConnect }: FlowNavigatorProps) => {
    const sections = [
        {
            title: 'PROJECT MANAGER',
            items: [
                { name: 'Settings', icon: Settings },
                { name: 'Add Sources', icon: Database },
            ]
        },
        {
            title: 'IP INTEGRATOR',
            items: [
                { name: 'Create Block Design', icon: Layers },
            ]
        },
        {
            title: 'SYNTHESIS',
            items: [
                { name: 'Run Synthesis', icon: Play, action: true },
                { name: 'Schematic', icon: Activity },
            ]
        },
        {
            title: 'IMPLEMENTATION',
            items: [
                { name: 'Run Implementation', icon: Play, action: true },
            ]
        },
        {
            title: 'PROGRAM AND DEBUG',
            items: [
                { name: 'Generate Bitstream', icon: Cpu },
            ]
        },
        {
            title: 'BRING UP',
            items: [
                { name: 'Cloud Connect', icon: Cloud, onClick: onCloudConnect },
            ]
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto py-2">
            {sections.map((section, idx) => (
                <div key={idx} className="mb-4">
                    <div className="px-4 py-1 text-xs font-bold text-gray-500 mb-1">
                        {section.title}
                    </div>
                    {section.items.map((item, itemIdx) => (
                        <button
                            key={itemIdx}
                            onClick={'onClick' in item ? item.onClick : undefined}
                            className="w-full px-4 py-2 flex items-center gap-3 hover:bg-vivado-border text-sm transition-colors text-left"
                        >
                            <item.icon size={16} className={'action' in item && item.action ? "text-green-500" : "text-blue-400"} />
                            <span>{item.name}</span>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};
