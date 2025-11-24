
interface EditorProps {
    fileId: string;
}

export const Editor = ({ fileId }: EditorProps) => {
    return (
        <div className="h-full flex flex-col">
            <div className="bg-vivado-panel border-b border-vivado-border px-4 py-2 text-sm font-mono">
                {fileId}
            </div>
            <textarea
                className="flex-1 bg-vivado-bg text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none"
                defaultValue={`// Contents of ${fileId}\n\nmodule ${fileId.split('.')[0]} (\n    input clk,\n    input rst_n\n);\n\n    // TODO: Implement logic\n\nendmodule`}
            />
        </div>
    );
};
