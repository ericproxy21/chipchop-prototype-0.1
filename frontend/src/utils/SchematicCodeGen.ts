import type { SchematicDesign, SchematicComponent, SchematicWire, CodeGenOptions, GeneratedCode } from '../types/design';

/**
 * Generate Verilog RTL code from a schematic design
 */
export function generateVerilogFromSchematic(
    design: SchematicDesign,
    options: CodeGenOptions = { language: 'verilog', includeComments: true, includeTestbench: false }
): GeneratedCode {
    const warnings: string[] = [];
    let code = '';

    // Header comment
    if (options.includeComments) {
        code += `//============================================================================\n`;
        code += `// Module: ${design.name}\n`;
        code += `// Generated from schematic design\n`;
        code += `// Date: ${new Date().toISOString()}\n`;
        code += `//============================================================================\n\n`;
    }

    // Find all I/O ports
    const inputs = design.components.filter(c => c.type === 'INPUT');
    const outputs = design.components.filter(c => c.type === 'OUTPUT');

    // Module declaration
    code += `module ${design.name} (\n`;

    const portDeclarations: string[] = [];

    // Add inputs
    inputs.forEach(input => {
        const portName = input.properties?.name || input.label;
        const width = input.ports[0]?.width || 1;
        if (width > 1) {
            portDeclarations.push(`    input  [${width - 1}:0] ${portName}`);
        } else {
            portDeclarations.push(`    input  ${portName}`);
        }
    });

    // Add outputs
    outputs.forEach(output => {
        const portName = output.properties?.name || output.label;
        const width = output.ports[0]?.width || 1;
        if (width > 1) {
            portDeclarations.push(`    output [${width - 1}:0] ${portName}`);
        } else {
            portDeclarations.push(`    output ${portName}`);
        }
    });

    code += portDeclarations.join(',\n') + '\n);\n\n';

    // Internal wire declarations
    const internalWires = new Set<string>();
    design.wires.forEach(wire => {
        if (wire.label) {
            internalWires.add(wire.label);
        }
    });

    if (internalWires.size > 0) {
        if (options.includeComments) {
            code += `    // Internal wires\n`;
        }
        internalWires.forEach(wireName => {
            code += `    wire ${wireName};\n`;
        });
        code += '\n';
    }

    // Component instantiations
    const logicComponents = design.components.filter(c => c.type !== 'INPUT' && c.type !== 'OUTPUT');

    if (logicComponents.length > 0 && options.includeComments) {
        code += `    // Component instantiations\n`;
    }

    logicComponents.forEach((comp, idx) => {
        code += generateComponentVerilog(comp, idx, design.wires, options.includeComments);
    });

    code += `\nendmodule\n`;

    // Generate testbench if requested
    let testbench: string | undefined;
    if (options.includeTestbench) {
        testbench = generateTestbench(design, inputs, outputs);
    }

    return {
        module: code,
        testbench,
        warnings: warnings.length > 0 ? warnings : undefined,
    };
}

function generateComponentVerilog(
    comp: SchematicComponent,
    index: number,
    wires: SchematicWire[],
    includeComments: boolean
): string {
    let code = '';
    const instanceName = `${comp.type.toLowerCase()}_${index}`;

    if (includeComments) {
        code += `    // ${comp.label}\n`;
    }

    switch (comp.type) {
        case 'AND':
        case 'OR':
        case 'XOR':
        case 'NAND':
        case 'NOR':
            code += generateLogicGate(comp, instanceName, wires);
            break;
        case 'NOT':
            code += generateNotGate(comp, instanceName, wires);
            break;
        case 'DFF':
            code += generateDFF(comp, instanceName, wires);
            break;
        case 'REGISTER':
            code += generateRegister(comp, instanceName, wires);
            break;
        case 'ADDER':
            code += generateAdder(comp, instanceName, wires);
            break;
        case 'MUX2':
            code += generateMux(comp, instanceName, wires);
            break;
        default:
            code += `    // TODO: Implement ${comp.type}\n`;
    }

    return code;
}

function getWireForPort(portId: string, wires: SchematicWire[]): string {
    const wire = wires.find(w => w.source === portId || w.target === portId);
    return wire?.label || `wire_${portId.slice(0, 8)}`;
}

function generateLogicGate(comp: SchematicComponent, _instanceName: string, wires: SchematicWire[]): string {
    const inputA = getWireForPort(comp.ports.find(p => p.name === 'a')?.id || '', wires);
    const inputB = getWireForPort(comp.ports.find(p => p.name === 'b')?.id || '', wires);
    const output = getWireForPort(comp.ports.find(p => p.name === 'out')?.id || '', wires);

    const op = comp.type.toLowerCase();
    return `    assign ${output} = ${inputA} ${op} ${inputB};\n`;
}

function generateNotGate(comp: SchematicComponent, _instanceName: string, wires: SchematicWire[]): string {
    const input = getWireForPort(comp.ports.find(p => p.name === 'in')?.id || '', wires);
    const output = getWireForPort(comp.ports.find(p => p.name === 'out')?.id || '', wires);

    return `    assign ${output} = ~${input};\n`;
}

function generateDFF(comp: SchematicComponent, _instanceName: string, wires: SchematicWire[]): string {
    const d = getWireForPort(comp.ports.find(p => p.name === 'd')?.id || '', wires);
    const clk = getWireForPort(comp.ports.find(p => p.name === 'clk')?.id || '', wires);
    const rst = getWireForPort(comp.ports.find(p => p.name === 'rst')?.id || '', wires);
    const q = getWireForPort(comp.ports.find(p => p.name === 'q')?.id || '', wires);

    return `    always @(posedge ${clk} or posedge ${rst}) begin
        if (${rst})
            ${q} <= 1'b0;
        else
            ${q} <= ${d};
    end\n`;
}

function generateRegister(comp: SchematicComponent, instanceName: string, wires: SchematicWire[]): string {
    const width = comp.properties?.width || 8;
    const d = getWireForPort(comp.ports.find(p => p.name === 'd')?.id || '', wires);
    const clk = getWireForPort(comp.ports.find(p => p.name === 'clk')?.id || '', wires);
    const rst = getWireForPort(comp.ports.find(p => p.name === 'rst')?.id || '', wires);
    const en = getWireForPort(comp.ports.find(p => p.name === 'en')?.id || '', wires);
    const q = getWireForPort(comp.ports.find(p => p.name === 'q')?.id || '', wires);

    return `    reg [${width - 1}:0] ${instanceName}_reg;
    always @(posedge ${clk} or posedge ${rst}) begin
        if (${rst})
            ${instanceName}_reg <= ${width}'b0;
        else if (${en})
            ${instanceName}_reg <= ${d};
    end
    assign ${q} = ${instanceName}_reg;\n`;
}

function generateAdder(comp: SchematicComponent, _instanceName: string, wires: SchematicWire[]): string {
    const a = getWireForPort(comp.ports.find(p => p.name === 'a')?.id || '', wires);
    const b = getWireForPort(comp.ports.find(p => p.name === 'b')?.id || '', wires);
    const sum = getWireForPort(comp.ports.find(p => p.name === 'sum')?.id || '', wires);
    const carry = getWireForPort(comp.ports.find(p => p.name === 'carry')?.id || '', wires);

    return `    assign {${carry}, ${sum}} = ${a} + ${b};\n`;
}

function generateMux(comp: SchematicComponent, _instanceName: string, wires: SchematicWire[]): string {
    const in0 = getWireForPort(comp.ports.find(p => p.name === 'in0')?.id || '', wires);
    const in1 = getWireForPort(comp.ports.find(p => p.name === 'in1')?.id || '', wires);
    const sel = getWireForPort(comp.ports.find(p => p.name === 'sel')?.id || '', wires);
    const out = getWireForPort(comp.ports.find(p => p.name === 'out')?.id || '', wires);

    return `    assign ${out} = ${sel} ? ${in1} : ${in0};\n`;
}

function generateTestbench(design: SchematicDesign, inputs: SchematicComponent[], outputs: SchematicComponent[]): string {
    let tb = `//============================================================================\n`;
    tb += `// Testbench for ${design.name}\n`;
    tb += `//============================================================================\n\n`;
    tb += `\`timescale 1ns/1ps\n\n`;
    tb += `module ${design.name}_tb;\n\n`;

    // Declare testbench signals
    inputs.forEach(input => {
        const portName = input.properties?.name || input.label;
        const width = input.ports[0]?.width || 1;
        if (width > 1) {
            tb += `    reg [${width - 1}:0] ${portName};\n`;
        } else {
            tb += `    reg ${portName};\n`;
        }
    });

    outputs.forEach(output => {
        const portName = output.properties?.name || output.label;
        const width = output.ports[0]?.width || 1;
        if (width > 1) {
            tb += `    wire [${width - 1}:0] ${portName};\n`;
        } else {
            tb += `    wire ${portName};\n`;
        }
    });

    tb += `\n    // Instantiate DUT\n`;
    tb += `    ${design.name} dut (\n`;

    const connections: string[] = [];
    inputs.forEach(input => {
        const portName = input.properties?.name || input.label;
        connections.push(`        .${portName}(${portName})`);
    });
    outputs.forEach(output => {
        const portName = output.properties?.name || output.label;
        connections.push(`        .${portName}(${portName})`);
    });

    tb += connections.join(',\n') + '\n    );\n\n';

    tb += `    // Test stimulus\n`;
    tb += `    initial begin\n`;
    tb += `        $dumpfile("${design.name}_tb.vcd");\n`;
    tb += `        $dumpvars(0, ${design.name}_tb);\n\n`;
    tb += `        // Initialize inputs\n`;
    inputs.forEach(input => {
        const portName = input.properties?.name || input.label;
        tb += `        ${portName} = 0;\n`;
    });
    tb += `        #100;\n\n`;
    tb += `        // Add your test cases here\n\n`;
    tb += `        #1000 $finish;\n`;
    tb += `    end\n\n`;
    tb += `endmodule\n`;

    return tb;
}
