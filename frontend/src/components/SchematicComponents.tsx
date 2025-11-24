import type { ComponentType, ComponentDefinition } from '../types/design';

// Component library definitions for schematic editor

export const LOGIC_GATES: ComponentDefinition[] = [
    {
        type: 'AND',
        label: 'AND Gate',
        category: 'logic',
        icon: 'AND',
        defaultPorts: [
            { name: 'a', type: 'input', width: 1 },
            { name: 'b', type: 'input', width: 1 },
            { name: 'out', type: 'output', width: 1 },
        ],
    },
    {
        type: 'OR',
        label: 'OR Gate',
        category: 'logic',
        icon: 'OR',
        defaultPorts: [
            { name: 'a', type: 'input', width: 1 },
            { name: 'b', type: 'input', width: 1 },
            { name: 'out', type: 'output', width: 1 },
        ],
    },
    {
        type: 'NOT',
        label: 'NOT Gate',
        category: 'logic',
        icon: 'NOT',
        defaultPorts: [
            { name: 'in', type: 'input', width: 1 },
            { name: 'out', type: 'output', width: 1 },
        ],
    },
    {
        type: 'XOR',
        label: 'XOR Gate',
        category: 'logic',
        icon: 'XOR',
        defaultPorts: [
            { name: 'a', type: 'input', width: 1 },
            { name: 'b', type: 'input', width: 1 },
            { name: 'out', type: 'output', width: 1 },
        ],
    },
    {
        type: 'NAND',
        label: 'NAND Gate',
        category: 'logic',
        icon: 'NAND',
        defaultPorts: [
            { name: 'a', type: 'input', width: 1 },
            { name: 'b', type: 'input', width: 1 },
            { name: 'out', type: 'output', width: 1 },
        ],
    },
    {
        type: 'NOR',
        label: 'NOR Gate',
        category: 'logic',
        icon: 'NOR',
        defaultPorts: [
            { name: 'a', type: 'input', width: 1 },
            { name: 'b', type: 'input', width: 1 },
            { name: 'out', type: 'output', width: 1 },
        ],
    },
];

export const SEQUENTIAL_ELEMENTS: ComponentDefinition[] = [
    {
        type: 'DFF',
        label: 'D Flip-Flop',
        category: 'sequential',
        icon: 'DFF',
        defaultPorts: [
            { name: 'd', type: 'input', width: 1 },
            { name: 'clk', type: 'input', width: 1 },
            { name: 'rst', type: 'input', width: 1 },
            { name: 'q', type: 'output', width: 1 },
        ],
    },
    {
        type: 'REGISTER',
        label: 'Register',
        category: 'register',
        icon: 'REG',
        defaultPorts: [
            { name: 'd', type: 'input', width: 8 },
            { name: 'clk', type: 'input', width: 1 },
            { name: 'rst', type: 'input', width: 1 },
            { name: 'en', type: 'input', width: 1 },
            { name: 'q', type: 'output', width: 8 },
        ],
        properties: [
            { name: 'width', type: 'number', default: 8, label: 'Bit Width' },
        ],
    },
];

export const ARITHMETIC_COMPONENTS: ComponentDefinition[] = [
    {
        type: 'ADDER',
        label: 'Adder',
        category: 'arithmetic',
        icon: 'ADD',
        defaultPorts: [
            { name: 'a', type: 'input', width: 8 },
            { name: 'b', type: 'input', width: 8 },
            { name: 'sum', type: 'output', width: 8 },
            { name: 'carry', type: 'output', width: 1 },
        ],
        properties: [
            { name: 'width', type: 'number', default: 8, label: 'Bit Width' },
        ],
    },
    {
        type: 'COMPARATOR',
        label: 'Comparator',
        category: 'arithmetic',
        icon: 'CMP',
        defaultPorts: [
            { name: 'a', type: 'input', width: 8 },
            { name: 'b', type: 'input', width: 8 },
            { name: 'eq', type: 'output', width: 1 },
            { name: 'gt', type: 'output', width: 1 },
            { name: 'lt', type: 'output', width: 1 },
        ],
        properties: [
            { name: 'width', type: 'number', default: 8, label: 'Bit Width' },
        ],
    },
];

export const MULTIPLEXERS: ComponentDefinition[] = [
    {
        type: 'MUX2',
        label: '2:1 Multiplexer',
        category: 'mux',
        icon: 'MUX',
        defaultPorts: [
            { name: 'in0', type: 'input', width: 8 },
            { name: 'in1', type: 'input', width: 8 },
            { name: 'sel', type: 'input', width: 1 },
            { name: 'out', type: 'output', width: 8 },
        ],
        properties: [
            { name: 'width', type: 'number', default: 8, label: 'Bit Width' },
        ],
    },
];

export const IO_COMPONENTS: ComponentDefinition[] = [
    {
        type: 'INPUT',
        label: 'Input Port',
        category: 'io',
        icon: 'IN',
        defaultPorts: [
            { name: 'port', type: 'output', width: 1 },
        ],
        properties: [
            { name: 'name', type: 'string', default: 'input', label: 'Port Name' },
            { name: 'width', type: 'number', default: 1, label: 'Bit Width' },
        ],
    },
    {
        type: 'OUTPUT',
        label: 'Output Port',
        category: 'io',
        icon: 'OUT',
        defaultPorts: [
            { name: 'port', type: 'input', width: 1 },
        ],
        properties: [
            { name: 'name', type: 'string', default: 'output', label: 'Port Name' },
            { name: 'width', type: 'number', default: 1, label: 'Bit Width' },
        ],
    },
];

export const ALL_COMPONENTS: ComponentDefinition[] = [
    ...LOGIC_GATES,
    ...SEQUENTIAL_ELEMENTS,
    ...ARITHMETIC_COMPONENTS,
    ...MULTIPLEXERS,
    ...IO_COMPONENTS,
];

export const getComponentDefinition = (type: ComponentType): ComponentDefinition | undefined => {
    return ALL_COMPONENTS.find(comp => comp.type === type);
};
