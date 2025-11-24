# ChipChop Prototype 0.1

A modern web-based FPGA design tool with visual editors, real-time collaboration, and cloud integration.

## Features

### 🎨 Visual Design System
- **Schematic Editor** - Design gate-level circuits with logic gates, flip-flops, and arithmetic components
- **Block Diagram Editor** - Create system-level architectures with processors, memory, and peripherals
- **Automatic RTL Generation** - Generate Verilog code from visual designs
- **Hierarchical Design** - Create custom IP blocks and integrate them into larger systems

### 💻 Code Development
- **Source Code Editor** - Edit Verilog/VHDL files with syntax highlighting
- **Project Management** - Organize your design files and sources
- **Git Integration** - Version control built-in

### 🤝 Collaboration
- **Real-time Collaboration** - Work with team members simultaneously
- **Cloud Sync** - Save and sync projects to the cloud
- **Team Management** - Manage project members and permissions

### 🔧 FPGA Workflow
- **Synthesis** - Run synthesis on your designs
- **Implementation** - Place and route your design
- **Bitstream Generation** - Generate programming files
- **Reports** - View detailed reports for each stage

### 🤖 AI Assistant
- **Copilot** - AI-powered design assistance
- **Code Generation** - Get help writing RTL code
- **Design Suggestions** - Receive optimization recommendations

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ (for backend)

### Installation

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

## Using the Visual Design System

ChipChop includes powerful visual design tools. See the [Visual Design Guide](VISUAL_DESIGN_GUIDE.md) for detailed instructions.

### Quick Start - Schematic Editor

1. Open a project
2. Navigate to the **Design** tab
3. Click **Schematic** 
4. Click "Open Schematic Editor"
5. Drag components from the palette
6. Connect components with wires
7. Click "Generate RTL" to create Verilog code

### Quick Start - Block Diagram Editor

1. Open a project
2. Navigate to the **Design** tab
3. Click **Block Diagram**
4. Click "Open Block Diagram Editor"
5. Add IP blocks (processors, memory, peripherals)
6. Connect blocks with bus interfaces
7. Click "Wrapper" to generate top-level Verilog

## Project Structure

```
chipchop-prototype-0.1/
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── SchematicModal.tsx      # Schematic editor
│   │   │   ├── BlockDiagramEditor.tsx  # Block diagram editor
│   │   │   ├── DesignNavigator.tsx     # Design view navigation
│   │   │   └── ...
│   │   ├── types/         # TypeScript type definitions
│   │   │   └── design.ts  # Visual design types
│   │   └── utils/         # Utility functions
│   │       ├── SchematicCodeGen.ts     # Schematic RTL generator
│   │       └── BlockCodeGen.ts         # Block diagram wrapper generator
│   └── package.json
├── backend/               # FastAPI backend
│   ├── routers/          # API endpoints
│   │   ├── projects.py   # Project management
│   │   ├── designs.py    # Design save/load (TODO)
│   │   └── ...
│   ├── main.py           # FastAPI app
│   └── requirements.txt
└── VISUAL_DESIGN_GUIDE.md # Comprehensive visual design documentation
```

## Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Flow** - Interactive diagram editor
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **GitPython** - Git integration

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Development

### Running in Development Mode

```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Building for Production

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

## Features in Detail

### Visual Design System

The visual design system supports hierarchical hardware design:

1. **Gate-Level Design (Schematic)**
   - Logic gates (AND, OR, NOT, XOR, NAND, NOR)
   - Sequential elements (flip-flops, registers)
   - Arithmetic components (adders, comparators)
   - Multiplexers and I/O ports
   - Automatic Verilog generation

2. **System-Level Design (Block Diagram)**
   - ARM processors (Cortex-M0, Cortex-A9)
   - Memory controllers (DDR, SRAM)
   - Peripherals (GPIO, UART, SPI, I2C)
   - Bus interconnects (AXI, APB)
   - Top-level wrapper generation

3. **Integration**
   - Design custom logic in schematic editor
   - Package as custom IP block
   - Use in block diagram editor
   - Generate complete system

### Project Management

- Create and manage multiple projects
- Add project descriptions
- Organize design files
- Version control with Git

### Collaboration

- Real-time collaboration status
- Team member management
- Role-based permissions (edit, read, comment)
- Cloud synchronization

## Documentation

- [Visual Design Guide](VISUAL_DESIGN_GUIDE.md) - Comprehensive guide for visual editors
- [API Documentation](http://localhost:8000/docs) - Backend API reference

## Contributing

This is a prototype project. Contributions are welcome!

## License

[Add your license here]

## Support

For questions or issues, please refer to:
- [Visual Design Guide](VISUAL_DESIGN_GUIDE.md) for visual editor help
- API documentation for backend integration
- GitHub issues for bug reports

---

**ChipChop** - Making FPGA design visual, collaborative, and accessible.
