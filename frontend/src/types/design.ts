// Type definitions for visual design system

// ============= Schematic Editor Types =============

export type ComponentType =
    // Logic Gates
    | 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'XNOR'
    // Sequential Elements
    | 'DFF' | 'TFF' | 'JKFF' | 'LATCH'
    // Arithmetic
    | 'ADDER' | 'SUBTRACTOR' | 'MULTIPLIER' | 'COMPARATOR'
    // Multiplexers
    | 'MUX2' | 'MUX4' | 'MUX8' | 'DEMUX'
    // Registers and Counters
    | 'REGISTER' | 'COUNTER'
    // I/O
    | 'INPUT' | 'OUTPUT'
    // CPU Microarchitecture
    | 'CPU_PC' | 'CPU_BRANCH_LOGIC' | 'CPU_INSTRUCTION_MEMORY' | 'CPU_REGISTER_FILE'
    | 'CPU_ALU' | 'CPU_CONTROL_UNIT' | 'CPU_DATA_MEMORY' | 'CPU_PIPELINE_REGISTER'
    | 'CPU_MULTIPLIER' | 'CPU_HAZARD_LOGIC' | 'CPU_PREDICTOR' | 'CPU_BUS' | 'CPU_PERIPHERAL'
    // Custom
    | 'CUSTOM';

export interface SchematicPort {
    id: string;
    name: string;
    type: 'input' | 'output';
    width: number; // bit width, 1 for single bit
    position: { x: number; y: number };
}

export interface SchematicComponent {
    id: string;
    type: ComponentType;
    label: string;
    position: { x: number; y: number };
    ports: SchematicPort[];
    properties?: Record<string, any>;
}

export interface SchematicWire {
    id: string;
    source: string; // port id
    target: string; // port id
    label?: string;
}

export interface SchematicDesign {
    id: string;
    name: string;
    components: SchematicComponent[];
    wires: SchematicWire[];
    metadata: {
        created: string;
        modified: string;
        author?: string;
        description?: string;
    };
}

// ============= Block Diagram Types =============

export type BlockType =
    // Processors
    | 'ARM_CORTEX_M0' | 'ARM_CORTEX_M3' | 'ARM_CORTEX_A9' | 'RISCV'
    // Memory
    | 'DDR_CONTROLLER' | 'SRAM_CONTROLLER' | 'ROM'
    // DMA
    | 'DMA_ENGINE'
    // Peripherals
    | 'GPIO' | 'UART' | 'SPI' | 'I2C' | 'TIMER' | 'INTERRUPT_CTRL'
    // Interconnect
    | 'AXI_INTERCONNECT' | 'AHB_BUS' | 'APB_BRIDGE'
    // Clock/Reset
    | 'CLOCK_GEN' | 'RESET_CTRL'
    // Custom
    | 'CUSTOM_IP';

export type InterfaceType =
    | 'AXI4' | 'AXI4_LITE' | 'AXI_STREAM'
    | 'AHB' | 'APB'
    | 'WISHBONE'
    | 'CUSTOM';

export interface BlockInterface {
    id: string;
    name: string;
    type: InterfaceType;
    role: 'master' | 'slave';
    dataWidth: number;
    addressWidth?: number;
}

export interface IPBlock {
    id: string;
    type: BlockType;
    name: string;
    position: { x: number; y: number };
    interfaces: BlockInterface[];
    properties?: Record<string, any>;
    // Reference to schematic if custom IP
    schematicId?: string;
}

export interface BlockConnection {
    id: string;
    source: string; // interface id
    target: string; // interface id
    type: InterfaceType;
}

export interface BlockDiagram {
    id: string;
    name: string;
    blocks: IPBlock[];
    connections: BlockConnection[];
    addressMap?: AddressMapEntry[];
    metadata: {
        created: string;
        modified: string;
        author?: string;
        description?: string;
    };
}

export interface AddressMapEntry {
    blockId: string;
    interfaceId: string;
    baseAddress: string; // hex string
    size: string; // hex string
}

// ============= Unified Design Project =============

export interface DesignProject {
    id: string;
    name: string;
    description?: string;
    schematics: SchematicDesign[];
    blockDiagrams: BlockDiagram[];
    activeView: 'schematic' | 'block';
    activeSchematicId?: string;
    activeBlockDiagramId?: string;
}

// ============= Code Generation Types =============

export interface CodeGenOptions {
    language: 'verilog' | 'vhdl';
    includeComments: boolean;
    includeTestbench: boolean;
    style?: 'vivado' | 'quartus' | 'generic';
}

export interface GeneratedCode {
    module: string;
    testbench?: string;
    constraints?: string;
    warnings?: string[];
}

// ============= Component Library Definitions =============

export interface ComponentDefinition {
    type: ComponentType;
    label: string;
    category: 'logic' | 'sequential' | 'arithmetic' | 'mux' | 'register' | 'io' | 'cpu_core' | 'cpu_memory' | 'cpu_control' | 'cpu_optional';
    icon: string; // SVG path or component
    defaultPorts: Omit<SchematicPort, 'id' | 'position'>[];
    properties?: {
        name: string;
        type: 'number' | 'string' | 'boolean';
        default: any;
        label: string;
    }[];
}

export interface BlockDefinition {
    type: BlockType;
    label: string;
    category: 'processor' | 'memory' | 'peripheral' | 'interconnect' | 'clock' | 'custom';
    icon: string;
    defaultInterfaces: Omit<BlockInterface, 'id'>[];
    properties?: {
        name: string;
        type: 'number' | 'string' | 'boolean';
        default: any;
        label: string;
    }[];
}
