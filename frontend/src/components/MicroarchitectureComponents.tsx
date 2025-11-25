import type { ComponentDefinition } from '../types/design';

export const CPU_CORE_COMPONENTS: ComponentDefinition[] = [
    {
        type: 'CPU_PC',
        label: 'Program Counter',
        category: 'cpu_core',
        icon: 'PC',
        defaultPorts: [
            { name: 'clk', type: 'input', width: 1 },
            { name: 'rst', type: 'input', width: 1 },
            { name: 'next_pc', type: 'input', width: 32 },
            { name: 'pc', type: 'output', width: 32 },
        ],
    },
    {
        type: 'CPU_BRANCH_LOGIC',
        label: 'Branch Logic',
        category: 'cpu_core',
        icon: 'BR',
        defaultPorts: [
            { name: 'pc', type: 'input', width: 32 },
            { name: 'offset', type: 'input', width: 32 },
            { name: 'condition', type: 'input', width: 1 },
            { name: 'next_pc', type: 'output', width: 32 },
        ],
    },
    {
        type: 'CPU_REGISTER_FILE',
        label: 'Register File',
        category: 'cpu_core',
        icon: 'RF',
        defaultPorts: [
            { name: 'clk', type: 'input', width: 1 },
            { name: 'we', type: 'input', width: 1 },
            { name: 'rs1', type: 'input', width: 5 },
            { name: 'rs2', type: 'input', width: 5 },
            { name: 'rd', type: 'input', width: 5 },
            { name: 'wdata', type: 'input', width: 32 },
            { name: 'rdata1', type: 'output', width: 32 },
            { name: 'rdata2', type: 'output', width: 32 },
        ],
    },
    {
        type: 'CPU_ALU',
        label: 'ALU',
        category: 'cpu_core',
        icon: 'ALU',
        defaultPorts: [
            { name: 'a', type: 'input', width: 32 },
            { name: 'b', type: 'input', width: 32 },
            { name: 'op', type: 'input', width: 4 },
            { name: 'result', type: 'output', width: 32 },
            { name: 'zero', type: 'output', width: 1 },
        ],
    },
    {
        type: 'CPU_PIPELINE_REGISTER',
        label: 'Pipeline Reg',
        category: 'cpu_core',
        icon: 'PREG',
        defaultPorts: [
            { name: 'clk', type: 'input', width: 1 },
            { name: 'rst', type: 'input', width: 1 },
            { name: 'in', type: 'input', width: 32 },
            { name: 'out', type: 'output', width: 32 },
        ],
    },
];

export const CPU_MEMORY_COMPONENTS: ComponentDefinition[] = [
    {
        type: 'CPU_INSTRUCTION_MEMORY',
        label: 'Instr Memory',
        category: 'cpu_memory',
        icon: 'IMEM',
        defaultPorts: [
            { name: 'addr', type: 'input', width: 32 },
            { name: 'instr', type: 'output', width: 32 },
        ],
    },
    {
        type: 'CPU_DATA_MEMORY',
        label: 'Data Memory',
        category: 'cpu_memory',
        icon: 'DMEM',
        defaultPorts: [
            { name: 'clk', type: 'input', width: 1 },
            { name: 'we', type: 'input', width: 1 },
            { name: 'addr', type: 'input', width: 32 },
            { name: 'wdata', type: 'input', width: 32 },
            { name: 'rdata', type: 'output', width: 32 },
        ],
    },
];

export const CPU_CONTROL_COMPONENTS: ComponentDefinition[] = [
    {
        type: 'CPU_CONTROL_UNIT',
        label: 'Control Unit',
        category: 'cpu_control',
        icon: 'CTRL',
        defaultPorts: [
            { name: 'opcode', type: 'input', width: 7 },
            { name: 'funct3', type: 'input', width: 3 },
            { name: 'funct7', type: 'input', width: 7 },
            { name: 'alu_op', type: 'output', width: 4 },
            { name: 'reg_we', type: 'output', width: 1 },
            { name: 'mem_we', type: 'output', width: 1 },
            { name: 'branch', type: 'output', width: 1 },
        ],
    },
];

export const CPU_OPTIONAL_COMPONENTS: ComponentDefinition[] = [
    {
        type: 'CPU_MULTIPLIER',
        label: 'Multiplier',
        category: 'cpu_optional',
        icon: 'MUL',
        defaultPorts: [
            { name: 'a', type: 'input', width: 32 },
            { name: 'b', type: 'input', width: 32 },
            { name: 'prod', type: 'output', width: 64 },
        ],
    },
    {
        type: 'CPU_HAZARD_LOGIC',
        label: 'Hazard Unit',
        category: 'cpu_optional',
        icon: 'HZD',
        defaultPorts: [
            { name: 'rs1', type: 'input', width: 5 },
            { name: 'rs2', type: 'input', width: 5 },
            { name: 'stall', type: 'output', width: 1 },
            { name: 'flush', type: 'output', width: 1 },
        ],
    },
    {
        type: 'CPU_PREDICTOR',
        label: 'Branch Predictor',
        category: 'cpu_optional',
        icon: 'PRED',
        defaultPorts: [
            { name: 'pc', type: 'input', width: 32 },
            { name: 'taken', type: 'output', width: 1 },
        ],
    },
    {
        type: 'CPU_BUS',
        label: 'Bus Interconnect',
        category: 'cpu_optional',
        icon: 'BUS',
        defaultPorts: [
            { name: 'addr', type: 'input', width: 32 },
            { name: 'data', type: 'input', width: 32 },
        ],
    },
    {
        type: 'CPU_PERIPHERAL',
        label: 'Peripheral',
        category: 'cpu_optional',
        icon: 'PERI',
        defaultPorts: [
            { name: 'clk', type: 'input', width: 1 },
            { name: 'addr', type: 'input', width: 32 },
            { name: 'wdata', type: 'input', width: 32 },
            { name: 'rdata', type: 'output', width: 32 },
        ],
    },
];

export const MICROARCHITECTURE_COMPONENTS: ComponentDefinition[] = [
    ...CPU_CORE_COMPONENTS,
    ...CPU_MEMORY_COMPONENTS,
    ...CPU_CONTROL_COMPONENTS,
    ...CPU_OPTIONAL_COMPONENTS,
];
