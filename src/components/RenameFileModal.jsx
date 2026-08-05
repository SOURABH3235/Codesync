import { useState, useEffect } from "react";

function RenameFileModal({
    file,
    onClose,
    onRename
}) {

    const [fileName, setFileName] = useState("");

    useEffect(() => {

        if (file) {
            setFileName(file.fileName);
        }

    }, [file]);

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!fileName.trim()) {
            alert("File name cannot be empty.");
            return;
        }

        onRename(file.id, fileName.trim());

    };

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

            <div className="bg-slate-900 w-96 rounded-xl p-6 shadow-2xl">

                <h2 className="text-2xl font-bold text-white mb-5">
                    Rename File
                </h2>

                <form onSubmit={handleSubmit}>

                    <label className="block text-gray-300 mb-2">
                        File Name
                    </label>

                    <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none border border-slate-700 focus:border-blue-500"
                        autoFocus
                        required
                    />

                    <div className="flex justify-end gap-3 mt-6">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Rename
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default RenameFileModal;