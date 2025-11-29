export const exampleProjectData = {
    architectureContent: `# GCD Accelerator Architecture

**Description**: A hardware module that computes the GCD of two 8-bit numbers using Euclid's subtraction algorithm.

**Interface**:
- **Inputs**:
  - \`clk\`: System clock
  - \`rst_n\`: Active low reset
  - \`start\`: Signal to begin computation
  - \`a_in [7:0]\`: First operand
  - \`b_in [7:0]\`: Second operand
- **Outputs**:
  - \`result [7:0]\`: The computed GCD
  - \`done\`: Signal indicating computation is complete
  - \`ready\`: Signal indicating module is ready for new input`,

    rtlContent: `module gcd_accelerator (
    input  wire       clk,
    input  wire       rst_n,
    input  wire       start,
    input  wire [7:0] a_in,
    input  wire [7:0] b_in,
    output reg  [7:0] result,
    output reg        done,
    output reg        ready
);

    // State definitions
    localparam IDLE  = 2'b00;
    localparam CALC  = 2'b01;
    localparam FINISH = 2'b10;

    reg [1:0] state, next_state;
    reg [7:0] reg_a, next_a;
    reg [7:0] reg_b, next_b;

    // State Register
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            state <= IDLE;
            reg_a <= 8'b0;
            reg_b <= 8'b0;
        end else begin
            state <= next_state;
            reg_a <= next_a;
            reg_b <= next_b;
        end
    end

    // Next State and Output Logic
    always @(*) begin
        // Defaults
        next_state = state;
        next_a = reg_a;
        next_b = reg_b;
        done = 1'b0;
        ready = 1'b0;
        result = 8'b0;

        case (state)
            IDLE: begin
                ready = 1'b1;
                if (start) begin
                    next_a = a_in;
                    next_b = b_in;
                    next_state = CALC;
                end
            end

            CALC: begin
                if (reg_a == reg_b) begin
                    next_state = FINISH;
                end else if (reg_a > reg_b) begin
                    next_a = reg_a - reg_b;
                end else begin
                    next_b = reg_b - reg_a;
                end
            end

            FINISH: begin
                done = 1'b1;
                result = reg_a; // or reg_b, they are equal
                next_state = IDLE;
            end
            
            default: next_state = IDLE;
        endcase
    end

endmodule`,

    microarchitectureContent: JSON.stringify({
        id: 'gcd-microarch',
        name: 'GCD Microarchitecture',
        components: [
            { id: 'c1', type: 'REGISTER', label: 'Reg A', position: { x: 200, y: 100 }, ports: [] },
            { id: 'c2', type: 'REGISTER', label: 'Reg B', position: { x: 200, y: 300 }, ports: [] },
            { id: 'c3', type: 'SUBTRACTOR', label: 'Sub A-B', position: { x: 400, y: 100 }, ports: [] },
            { id: 'c4', type: 'SUBTRACTOR', label: 'Sub B-A', position: { x: 400, y: 300 }, ports: [] },
            { id: 'c5', type: 'COMPARATOR', label: 'Compare', position: { x: 300, y: 200 }, ports: [] },
            { id: 'c6', type: 'MUX2', label: 'Mux A', position: { x: 100, y: 100 }, ports: [] },
            { id: 'c7', type: 'MUX2', label: 'Mux B', position: { x: 100, y: 300 }, ports: [] },
            { id: 'c8', type: 'CPU_CONTROL_UNIT', label: 'FSM Control', position: { x: 300, y: 50 }, ports: [] }
        ],
        wires: [],
        metadata: { created: new Date().toISOString(), modified: new Date().toISOString() }
    })
};
