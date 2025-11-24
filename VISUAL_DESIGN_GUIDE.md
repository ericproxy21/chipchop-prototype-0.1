# ChipChop Visual Design Guide

Welcome to the ChipChop Visual Design System! This guide will help you create hardware designs using our interactive visual editors.

## Overview

ChipChop provides two complementary visual design tools:

1. **Schematic Editor** - Gate-level circuit design with automatic RTL generation
2. **Block Diagram Editor** - System-level IP integration with wrapper generation

These tools work together to support hierarchical hardware design at multiple abstraction levels.

---

## Getting Started

### Accessing the Design Editors

1. Open a project in ChipChop
2. Navigate to the **Design** tab in the workspace
3. Choose between **Block Diagram** (system-level) or **Schematic** (gate-level)

---

## Schematic Editor (Gate-Level Design)

The Schematic Editor allows you to design digital circuits visually using logic gates, flip-flops, and other components.

### Features

- **Interactive Canvas** - Drag, drop, and connect components
- **Component Library** - Logic gates, sequential elements, arithmetic units, multiplexers, and I/O ports
- **Automatic Wiring** - Connect components with visual wires
- **RTL Code Generation** - Automatically generate Verilog code from your schematic
- **Save/Load** - Save your designs and reload them later

### Component Categories

#### Logic Gates
- AND, OR, NOT, XOR, NAND, NOR gates
- Configurable bit widths

#### Sequential Elements
- D Flip-Flop (DFF)
- Registers with enable and reset
- Configurable widths

#### Arithmetic Components
- Adders with carry output
- Comparators (equal, greater than, less than)
- Configurable bit widths

#### Multiplexers
- 2:1 Multiplexer
- Configurable data widths

#### I/O Ports
- Input ports
- Output ports
- Configurable names and bit widths

### Workflow Example

#### 1. Create a Simple Counter

**Step 1: Add Components**
1. Click "Open Schematic Editor"
2. Select "register" category
3. Click "Register" to add a register component
4. Select "arithmetic" category
5. Click "Adder" to add an adder
6. Select "io" category
7. Add "Input Port" for clock
8. Add "Input Port" for reset
9. Add "Output Port" for counter value

**Step 2: Connect Components**
1. Drag from output port of one component to input port of another
2. Connections appear as blue lines
3. Connect clock to register clock input
4. Connect reset to register reset input
5. Connect register output to adder input A
6. Connect adder output to register input
7. Connect register output to output port

**Step 3: Generate RTL Code**
1. Click "Generate RTL" button
2. Review the generated Verilog code
3. Click "Download" to save the `.v` file
4. The code is ready for synthesis!

**Example Generated Code:**
```verilog
//============================================================================
// Module: my_counter
// Generated from schematic design
//============================================================================

module my_counter (
    input  clk,
    input  rst,
    output [7:0] count
);

    // Internal wires
    wire [7:0] adder_out;
    wire carry;

    // Register instance
    reg [7:0] register_0_reg;
    always @(posedge clk or posedge rst) begin
        if (rst)
            register_0_reg <= 8'b0;
        else
            register_0_reg <= adder_out;
    end
    assign count = register_0_reg;

    // Adder instance
    assign {carry, adder_out} = count + 8'b1;

endmodule
```

### Tips for Schematic Design

- **Start with I/O** - Define your input and output ports first
- **Use Clear Labels** - Name your wires and components descriptively
- **Test Incrementally** - Generate RTL frequently to catch errors early
- **Save Often** - Click "Save" to preserve your work

---

## Block Diagram Editor (System-Level Design)

The Block Diagram Editor allows you to create system-level architectures by connecting IP blocks.

### Features

- **IP Block Library** - Processors, memory controllers, peripherals, and more
- **Bus Interfaces** - AXI4, AXI-Lite, APB support
- **Automatic Connections** - Drag and drop to connect blocks
- **Wrapper Generation** - Generate top-level Verilog wrapper
- **Constraints Generation** - Generate XDC constraint files

### IP Block Categories

#### Processors
- ARM Cortex-M0 (32-bit microcontroller)
- ARM Cortex-A9 (Application processor)
- RISC-V Core

#### Memory
- DDR Memory Controller
- SRAM Controller
- ROM

#### Peripherals
- GPIO Controller
- UART Controller
- SPI Controller
- I2C Controller

#### Interconnect
- AXI Interconnect (crossbar)
- APB Bridge

#### Clock/Reset
- Clock Generator
- Reset Controller

#### Custom
- Custom IP Block (link to your schematic designs)

### Workflow Example

#### Create a Simple Microcontroller System

**Step 1: Add IP Blocks**
1. Click "Open Block Diagram Editor"
2. Select "processor" category
3. Click "ARM Cortex-M0" to add processor
4. Select "memory" category
5. Add "SRAM Controller"
6. Select "peripheral" category
7. Add "GPIO Controller"
8. Add "UART Controller"
9. Select "interconnect" category
10. Add "AXI Interconnect"

**Step 2: Connect Blocks**
1. Drag from processor's AXI master to interconnect's AXI slave
2. Drag from interconnect's AXI master 0 to SRAM's AXI slave
3. Drag from interconnect's AXI master 1 to APB bridge
4. Connect peripherals to APB bridge

**Step 3: Generate Wrapper**
1. Click "Wrapper" button to generate top-level Verilog
2. Click "XDC" button to generate constraints
3. Download both files
4. Import into your FPGA tool (Vivado, Quartus, etc.)

**Example Generated Wrapper:**
```verilog
//============================================================================
// Top-Level Module: my_system_top
// Generated from block diagram
//============================================================================

module my_system_top (
    input  wire clk,
    input  wire rst_n
);

    // Clock and Reset
    wire sys_clk = clk;
    wire sys_rst = ~rst_n;

    // AXI Interface signals...
    
    // ARM Cortex-M0 instance
    arm_cortex_m0 processor_inst (
        .clk(sys_clk),
        .rst(sys_rst),
        .axi_master_awaddr(axi_0_awaddr),
        // ... more connections
    );

    // SRAM Controller instance
    sram_controller memory_inst (
        .clk(sys_clk),
        .rst(sys_rst),
        .axi_slave_awaddr(axi_1_awaddr),
        // ... more connections
    );

endmodule
```

### Tips for Block Diagram Design

- **Plan Your Architecture** - Sketch your system before building
- **Use Standard Interfaces** - Stick to AXI/APB for compatibility
- **Check Address Maps** - Ensure no address conflicts
- **Generate Early** - Create wrappers frequently to verify connections

---

## Integration: Schematic → Block Diagram

One of the most powerful features is creating custom IP in the Schematic Editor and using it in the Block Diagram.

### Workflow

**Step 1: Design Custom Logic (Schematic)**
1. Open Schematic Editor
2. Create your custom circuit (e.g., DSP filter, custom controller)
3. Define clear input/output ports
4. Generate and verify RTL code
5. Click "Save" - your design is saved as custom IP

**Step 2: Package as IP**
1. Note the name of your schematic design
2. The design is automatically available as custom IP

**Step 3: Use in Block Diagram**
1. Open Block Diagram Editor
2. Select "custom" category
3. Add "Custom IP Block"
4. Configure it to reference your schematic
5. Connect to system buses
6. Generate top-level wrapper

### Example: Custom Accelerator

1. **Schematic**: Design a matrix multiplier with AXI-Lite slave interface
2. **Generate RTL**: Create the Verilog module
3. **Block Diagram**: Add as custom IP block
4. **Connect**: Wire to processor's AXI master
5. **Generate**: Create complete system wrapper

---

## Keyboard Shortcuts

### Schematic Editor
- **Delete**: Remove selected component
- **Ctrl+S**: Save schematic
- **Ctrl+G**: Generate RTL code
- **Esc**: Deselect all

### Block Diagram Editor
- **Delete**: Remove selected block
- **Ctrl+S**: Save block diagram
- **Ctrl+W**: Generate wrapper
- **Esc**: Deselect all

---

## Best Practices

### General
- **Save Frequently** - Both editors auto-save to localStorage, but manual saves are recommended
- **Use Descriptive Names** - Name your designs, components, and signals clearly
- **Comment Your Code** - Generated code includes comments; add more as needed
- **Version Control** - Save generated RTL files to Git

### Schematic Editor
- **Keep It Simple** - Break complex designs into hierarchical modules
- **Use Buses** - Group related signals with multi-bit ports
- **Verify Connectivity** - Ensure all ports are connected before generating RTL

### Block Diagram Editor
- **Follow Standards** - Use AXI4 for high-performance, AXI-Lite for control
- **Document Addresses** - Keep track of your address map
- **Test Incrementally** - Add one block at a time and verify

---

## Troubleshooting

### Schematic Editor

**Q: Generated code has errors**
- Check that all ports are connected
- Verify component properties (bit widths, etc.)
- Ensure no floating wires

**Q: Can't connect two ports**
- Verify port types match (input to output)
- Check bit widths are compatible

### Block Diagram Editor

**Q: Wrapper generation fails**
- Ensure all blocks have valid connections
- Check that interface types match (AXI to AXI, etc.)

**Q: Address conflicts**
- Review your address map
- Ensure each slave has unique address range

---

## Advanced Topics

### Custom Component Libraries
You can extend the component libraries by modifying:
- `SchematicComponents.tsx` - Add new schematic components
- `BlockComponents.tsx` - Add new IP blocks

### Code Generation Customization
Modify the code generators:
- `SchematicCodeGen.ts` - Customize Verilog generation for schematics
- `BlockCodeGen.ts` - Customize wrapper generation for block diagrams

### Integration with Synthesis Tools
1. Generate RTL code from your designs
2. Import into Vivado, Quartus, or other FPGA tools
3. Run synthesis and implementation
4. Generate bitstream for your target device

---

## Examples

### Example 1: Simple ALU (Schematic)
- Components: 2 inputs, adder, subtractor, multiplexer, 1 output
- Functionality: Selectable add/subtract operation
- Generated: ~30 lines of Verilog

### Example 2: UART System (Block Diagram)
- Blocks: ARM Cortex-M0, SRAM, UART, AXI Interconnect
- Interfaces: AXI4-Lite throughout
- Generated: Complete system wrapper with ~200 lines

### Example 3: Custom Accelerator System (Both)
- Schematic: Design custom matrix multiplier
- Block Diagram: Integrate with processor and memory
- Result: Complete SoC with custom acceleration

---

## Support

For questions or issues:
- Check this guide first
- Review generated code for hints
- Consult Verilog/VHDL documentation for RTL questions
- Check FPGA vendor documentation for synthesis issues

---

## Summary

The ChipChop Visual Design System provides:
- ✅ **Schematic Editor** for gate-level design
- ✅ **Block Diagram Editor** for system-level integration
- ✅ **Automatic RTL Generation** from both editors
- ✅ **Hierarchical Design** support
- ✅ **Standard Interfaces** (AXI, APB)
- ✅ **Save/Load** functionality
- ✅ **Export** to Verilog and XDC

Start designing visually and let ChipChop generate production-ready RTL code for you!
