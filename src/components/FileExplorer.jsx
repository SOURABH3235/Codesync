import { FaFileCode, FaPlus, FaTrash ,FaEdit} from "react-icons/fa";

function FileExplorer({
    files,
    selectedFile,
    openFile,
    onCreateFile,
    onDeleteFile,
    onRenameFile
}) {

    return (

        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-800">

                <h2 className="text-white text-lg font-semibold">
                    Explorer
                </h2>

                <button
                    onClick={onCreateFile}
                    className="text-blue-400 hover:text-blue-500 transition"
                    title="Create New File"
                >
                    <FaPlus size={18} />
                </button>

            </div>

            {/* Files */}
            <div className="flex-1 overflow-y-auto">

                {files.length === 0 ? (

                    <div className="text-gray-400 text-center mt-8">
                        No Files Found
                    </div>

                ) : (

                    files.map((file) => (

                        <div
                            key={file.id}
                            className={`flex justify-between items-center px-4 py-3 border-b border-slate-800 transition
                            ${
                                selectedFile?.id === file.id
                                    ? "bg-slate-800"
                                    : "hover:bg-slate-800"
                            }`}
                        >

                            {/* File */}
                            <div
                                onClick={() => openFile(file.id)}
                                className="flex items-center gap-3 cursor-pointer flex-1"
                            >

                                <FaFileCode className="text-blue-400" />

                                <span className="text-white truncate">
                                    {file.fileName}
                                </span>

                            </div>

                            <div className="flex gap-2">

    <button
        onClick={() => onRenameFile(file)}
        className="text-yellow-400 hover:text-yellow-500"
        title="Rename"
    >
        <FaEdit />
    </button>

    <button
        onClick={() => onDeleteFile(file.id)}
        className="text-red-500 hover:text-red-700"
        title="Delete"
    >
        <FaTrash />
    </button>

</div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default FileExplorer;