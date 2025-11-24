import type { BlockType, BlockDefinition } from '../types/design';

// IP Block library definitions for block diagram editor

export const PROCESSOR_BLOCKS: BlockDefinition[] = [
    {
        type: 'ARM_CORTEX_M0',
        label: 'ARM Cortex-M0',
        category: 'processor',
        icon: 'CPU',
        defaultInterfaces: [
            { name: 'axi_master', type: 'AXI4_LITE', role: 'master', dataWidth: 32, addressWidth: 32 },
            { name: 'debug', type: 'CUSTOM', role: 'slave', dataWidth: 32 },
        ],
    },
    {
        type: 'ARM_CORTEX_A9',
        label: 'ARM Cortex-A9',
        category: 'processor',
        icon: 'CPU',
        defaultInterfaces: [
            { name: 'axi_master', type: 'AXI4', role: 'master', dataWidth: 64, addressWidth: 32 },
            { name: 'axi_slave', type: 'AXI4', role: 'slave', dataWidth: 64, addressWidth: 32 },
        ],
    },
    {
        type: 'RISCV',
        label: 'RISC-V Core',
        category: 'processor',
        icon: 'CPU',
        defaultInterfaces: [
            { name: 'axi_master', type: 'AXI4', role: 'master', dataWidth: 32, addressWidth: 32 },
        ],
    },
];

export const MEMORY_BLOCKS: BlockDefinition[] = [
    {
        type: 'DDR_CONTROLLER',
        label: 'DDR Memory Controller',
        category: 'memory',
        icon: 'MEM',
        defaultInterfaces: [
            { name: 'axi_slave', type: 'AXI4', role: 'slave', dataWidth: 64, addressWidth: 32 },
        ],
        properties: [
            { name: 'size_mb', type: 'number', default: 512, label: 'Memory Size (MB)' },
        ],
    },
    {
        type: 'SRAM_CONTROLLER',
        label: 'SRAM Controller',
        category: 'memory',
        icon: 'MEM',
        defaultInterfaces: [
            { name: 'axi_slave', type: 'AXI4_LITE', role: 'slave', dataWidth: 32, addressWidth: 16 },
        ],
        properties: [
            { name: 'size_kb', type: 'number', default: 64, label: 'Memory Size (KB)' },
        ],
    },
];

export const PERIPHERAL_BLOCKS: BlockDefinition[] = [
    {
        type: 'GPIO',
        label: 'GPIO Controller',
        category: 'peripheral',
        icon: 'GPIO',
        defaultInterfaces: [
            { name: 'apb_slave', type: 'APB', role: 'slave', dataWidth: 32 },
        ],
        properties: [
            { name: 'num_pins', type: 'number', default: 32, label: 'Number of Pins' },
        ],
    },
    {
        type: 'UART',
        label: 'UART Controller',
        category: 'peripheral',
        icon: 'UART',
        defaultInterfaces: [
            { name: 'apb_slave', type: 'APB', role: 'slave', dataWidth: 32 },
        ],
        properties: [
            { name: 'baud_rate', type: 'number', default: 115200, label: 'Baud Rate' },
        ],
    },
    {
        type: 'SPI',
        label: 'SPI Controller',
        category: 'peripheral',
        icon: 'SPI',
        defaultInterfaces: [
            { name: 'apb_slave', type: 'APB', role: 'slave', dataWidth: 32 },
        ],
    },
    {
        type: 'I2C',
        label: 'I2C Controller',
        category: 'peripheral',
        icon: 'I2C',
        defaultInterfaces: [
            { name: 'apb_slave', type: 'APB', role: 'slave', dataWidth: 32 },
        ],
    },
];

export const INTERCONNECT_BLOCKS: BlockDefinition[] = [
    {
        type: 'AXI_INTERCONNECT',
        label: 'AXI Interconnect',
        category: 'interconnect',
        icon: 'BUS',
        defaultInterfaces: [
            { name: 'axi_slave_0', type: 'AXI4', role: 'slave', dataWidth: 64, addressWidth: 32 },
            { name: 'axi_master_0', type: 'AXI4', role: 'master', dataWidth: 64, addressWidth: 32 },
            { name: 'axi_master_1', type: 'AXI4', role: 'master', dataWidth: 64, addressWidth: 32 },
        ],
        properties: [
            { name: 'num_masters', type: 'number', default: 2, label: 'Number of Masters' },
            { name: 'num_slaves', type: 'number', default: 1, label: 'Number of Slaves' },
        ],
    },
    {
        type: 'APB_BRIDGE',
        label: 'APB Bridge',
        category: 'interconnect',
        icon: 'BRIDGE',
        defaultInterfaces: [
            { name: 'axi_slave', type: 'AXI4_LITE', role: 'slave', dataWidth: 32 },
            { name: 'apb_master', type: 'APB', role: 'master', dataWidth: 32 },
        ],
    },
];

export const CLOCK_RESET_BLOCKS: BlockDefinition[] = [
    {
        type: 'CLOCK_GEN',
        label: 'Clock Generator',
        category: 'clock',
        icon: 'CLK',
        defaultInterfaces: [],
        properties: [
            { name: 'frequency_mhz', type: 'number', default: 100, label: 'Frequency (MHz)' },
        ],
    },
    {
        type: 'RESET_CTRL',
        label: 'Reset Controller',
        category: 'clock',
        icon: 'RST',
        defaultInterfaces: [],
    },
];

export const CUSTOM_BLOCKS: BlockDefinition[] = [
    {
        type: 'CUSTOM_IP',
        label: 'Custom IP Block',
        category: 'custom',
        icon: 'CUSTOM',
        defaultInterfaces: [
            { name: 'axi_slave', type: 'AXI4_LITE', role: 'slave', dataWidth: 32 },
        ],
        properties: [
            { name: 'name', type: 'string', default: 'my_custom_ip', label: 'IP Name' },
        ],
    },
];

export const ALL_BLOCKS: BlockDefinition[] = [
    ...PROCESSOR_BLOCKS,
    ...MEMORY_BLOCKS,
    ...PERIPHERAL_BLOCKS,
    ...INTERCONNECT_BLOCKS,
    ...CLOCK_RESET_BLOCKS,
    ...CUSTOM_BLOCKS,
];

export const getBlockDefinition = (type: BlockType): BlockDefinition | undefined => {
    return ALL_BLOCKS.find(block => block.type === type);
};
