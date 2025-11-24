import type { BlockDiagram, IPBlock, BlockConnection, CodeGenOptions } from '../types/design';

/**
 * Generate top-level Verilog wrapper from block diagram
 */
export function generateWrapperFromBlockDiagram(
    diagram: BlockDiagram,
    options: CodeGenOptions = { language: 'verilog', includeComments: true, includeTestbench: false }
): string {
    let code = '';

    // Header
    if (options.includeComments) {
        code += `//============================================================================\n`;
        code += `// Top-Level Module: ${diagram.name}\n`;
        code += `// Generated from block diagram\n`;
        code += `// Date: ${new Date().toISOString()}\n`;
        code += `//============================================================================\n\n`;
    }

    // Module declaration
    code += `module ${diagram.name}_top (\n`;
    code += `    input  wire clk,\n`;
    code += `    input  wire rst_n\n`;
    code += `);\n\n`;

    // Clock and reset signals
    if (options.includeComments) {
        code += `    // Clock and Reset\n`;
    }
    code += `    wire sys_clk = clk;\n`;
    code += `    wire sys_rst = ~rst_n;\n\n`;

    // Generate interconnect signals
    if (options.includeComments) {
        code += `    // Interconnect Signals\n`;
    }

    diagram.connections.forEach((conn, idx) => {
        const sourceBlock = diagram.blocks.find(b => b.interfaces.some(i => i.id === conn.source));
        const targetBlock = diagram.blocks.find(b => b.interfaces.some(i => i.id === conn.target));

        if (sourceBlock && targetBlock) {
            code += `    // ${sourceBlock.name} -> ${targetBlock.name}\n`;
            code += generateInterfaceSignals(conn, idx);
        }
    });

    code += '\n';

    // Instantiate blocks
    if (options.includeComments) {
        code += `    // IP Block Instantiations\n`;
    }

    diagram.blocks.forEach((block, idx) => {
        code += generateBlockInstantiation(block, idx, diagram.connections);
    });

    code += `\nendmodule\n`;

    return code;
}

function generateInterfaceSignals(conn: BlockConnection, index: number): string {
    let signals = '';
    const baseName = `axi_${index}`;

    switch (conn.type) {
        case 'AXI4':
        case 'AXI4_LITE':
            signals += `    // AXI Interface ${index}\n`;
            signals += `    wire [31:0] ${baseName}_awaddr;\n`;
            signals += `    wire        ${baseName}_awvalid;\n`;
            signals += `    wire        ${baseName}_awready;\n`;
            signals += `    wire [31:0] ${baseName}_wdata;\n`;
            signals += `    wire [3:0]  ${baseName}_wstrb;\n`;
            signals += `    wire        ${baseName}_wvalid;\n`;
            signals += `    wire        ${baseName}_wready;\n`;
            signals += `    wire [1:0]  ${baseName}_bresp;\n`;
            signals += `    wire        ${baseName}_bvalid;\n`;
            signals += `    wire        ${baseName}_bready;\n`;
            signals += `    wire [31:0] ${baseName}_araddr;\n`;
            signals += `    wire        ${baseName}_arvalid;\n`;
            signals += `    wire        ${baseName}_arready;\n`;
            signals += `    wire [31:0] ${baseName}_rdata;\n`;
            signals += `    wire [1:0]  ${baseName}_rresp;\n`;
            signals += `    wire        ${baseName}_rvalid;\n`;
            signals += `    wire        ${baseName}_rready;\n\n`;
            break;
        case 'APB':
            signals += `    // APB Interface ${index}\n`;
            signals += `    wire [31:0] ${baseName}_paddr;\n`;
            signals += `    wire        ${baseName}_psel;\n`;
            signals += `    wire        ${baseName}_penable;\n`;
            signals += `    wire        ${baseName}_pwrite;\n`;
            signals += `    wire [31:0] ${baseName}_pwdata;\n`;
            signals += `    wire [31:0] ${baseName}_prdata;\n`;
            signals += `    wire        ${baseName}_pready;\n\n`;
            break;
    }

    return signals;
}

function generateBlockInstantiation(block: IPBlock, _index: number, connections: BlockConnection[]): string {
    let code = '';
    const instanceName = `${block.name.toLowerCase().replace(/\s+/g, '_')}_inst`;

    code += `    // ${block.name}\n`;
    code += `    ${block.type.toLowerCase()} ${instanceName} (\n`;
    code += `        .clk(sys_clk),\n`;
    code += `        .rst(sys_rst)`;

    // Add interface connections
    block.interfaces.forEach(iface => {
        const conn = connections.find(c => c.source === iface.id || c.target === iface.id);
        if (conn) {
            const connIdx = connections.indexOf(conn);
            const baseName = `axi_${connIdx}`;

            code += `,\n        // ${iface.name}\n`;

            switch (iface.type) {
                case 'AXI4':
                case 'AXI4_LITE':
                    code += `        .${iface.name}_awaddr(${baseName}_awaddr),\n`;
                    code += `        .${iface.name}_awvalid(${baseName}_awvalid),\n`;
                    code += `        .${iface.name}_awready(${baseName}_awready),\n`;
                    code += `        .${iface.name}_wdata(${baseName}_wdata),\n`;
                    code += `        .${iface.name}_wstrb(${baseName}_wstrb),\n`;
                    code += `        .${iface.name}_wvalid(${baseName}_wvalid),\n`;
                    code += `        .${iface.name}_wready(${baseName}_wready),\n`;
                    code += `        .${iface.name}_bresp(${baseName}_bresp),\n`;
                    code += `        .${iface.name}_bvalid(${baseName}_bvalid),\n`;
                    code += `        .${iface.name}_bready(${baseName}_bready),\n`;
                    code += `        .${iface.name}_araddr(${baseName}_araddr),\n`;
                    code += `        .${iface.name}_arvalid(${baseName}_arvalid),\n`;
                    code += `        .${iface.name}_arready(${baseName}_arready),\n`;
                    code += `        .${iface.name}_rdata(${baseName}_rdata),\n`;
                    code += `        .${iface.name}_rresp(${baseName}_rresp),\n`;
                    code += `        .${iface.name}_rvalid(${baseName}_rvalid),\n`;
                    code += `        .${iface.name}_rready(${baseName}_rready)`;
                    break;
            }
        }
    });

    code += `\n    );\n\n`;

    return code;
}

/**
 * Generate XDC constraints file
 */
export function generateConstraints(diagram: BlockDiagram): string {
    let xdc = `# Constraints for ${diagram.name}\n`;
    xdc += `# Generated: ${new Date().toISOString()}\n\n`;

    xdc += `# Clock constraint\n`;
    xdc += `create_clock -period 10.000 -name sys_clk [get_ports clk]\n\n`;

    xdc += `# Reset constraint\n`;
    xdc += `set_property IOSTANDARD LVCMOS33 [get_ports rst_n]\n`;
    xdc += `set_false_path -from [get_ports rst_n]\n\n`;

    return xdc;
}
