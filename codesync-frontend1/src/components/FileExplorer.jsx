import { FaFileCode, FaJs, FaJava, FaHtml5, FaCss3Alt, FaReact, FaPython, FaTrash, FaEdit, FaPlus } from "react-icons/fa";

export const getFileIcon = (filename) => {
    if (!filename) return <FaFileCode className="text-slate-400" />;
    
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
        case 'js': return <FaJs className="text-yellow-400 text-lg" />;
        case 'jsx': return <FaReact className="text-blue-400 text-lg" />;
        case 'java': return <FaJava className="text-red-500 text-lg" />;
        case 'html': return <FaHtml5 className="text-orange-500 text-lg" />;
        case 'css': return <FaCss3Alt className="text-blue-500 text-lg" />;
        case 'py': return <FaPython className="text-blue-400 text-lg" />;
        default: return <FaFileCode className="text-slate-400 text-lg" />;
    }
};
function FileExplorer({
    files,
    selectedFile,
    openFile,
    onCreateFile,
    onDeleteFile,
    onRenameFile
}) {

   return (
        <div className="flex flex-col h-full bg-slate-900 text-slate-300">
            
            {/* EXPLORER HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 text-xs font-bold tracking-wider uppercase text-slate-400">
                <span>Explorer</span>
                <button 
                    onClick={onCreateFile}
                    className="hover:text-white transition-colors p-1 hover:bg-slate-800 rounded"
                    title="New File"
                >
                    <FaPlus />
                </button>
            </div>

            {/* FILE LIST */}
            <div className="flex-1 overflow-y-auto py-2">
                {files.length === 0 ? (
                    <div className="text-center text-slate-500 text-sm mt-4 italic">
                        No files yet.
                    </div>
                ) : (
                    files.map((file) => {
                        const isActive = selectedFile?.id === file.id;

                        return (
                            // 🛠️ The 'group' class allows us to detect hover on the whole row
                            <div 
                                key={file.id}
                                onClick={() => openFile(file.id)}
                                className={`
                                    group flex items-center justify-between px-3 py-1.5 cursor-pointer 
                                    transition-colors border-l-2 text-sm
                                    ${isActive 
                                        ? "bg-slate-800 border-indigo-500 text-white" 
                                        : "border-transparent hover:bg-slate-800/50 hover:text-slate-200"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    {getFileIcon(file.fileName)}
                                    <span className="truncate">{file.fileName}</span>
                                </div>

                                {/* 🛠️ Action buttons only show when the row is hovered! */}
                                <div className={`flex items-center gap-1 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRenameFile(file);
                                        }}
                                        className="text-slate-500 hover:text-blue-400 p-1.5 rounded hover:bg-slate-700 transition-colors"
                                        title="Rename"
                                    >
                                        <FaEdit size={12} />
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteFile(file.id);
                                        }}
                                        className="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-slate-700 transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default FileExplorer