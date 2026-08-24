function Console({ output }) {
    return (
        <div className="h-48 bg-black border-t border-slate-700 p-3 font-mono text-sm overflow-y-auto w-full flex flex-col">
            <div className="text-slate-400 mb-2 font-bold border-b border-slate-800 pb-1">
                Terminal Output
            </div>
            
            <div className="flex-1 overflow-y-auto">
                <pre className={`whitespace-pre-wrap ${output?.startsWith("Error") ? "text-red-400" : "text-green-400"}`}>
                    {output || "Ready. Click 'Run Code' to execute."}
                </pre>
            </div>
        </div>
    );
}

export default Console;