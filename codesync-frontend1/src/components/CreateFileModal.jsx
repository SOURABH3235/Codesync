import { useState } from "react";

function CreateFileModal({ onClose, onCreate }) {

    const [fileName, setFileName] = useState("");
    const [language, setLanguage] = useState("java");

    const handleSubmit = (e) => {
        e.preventDefault();

        onCreate({
            fileName,
            language
        });
    };

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">

            <div className="bg-slate-900 w-96 rounded-xl p-6">

                <h2 className="text-2xl font-bold text-white mb-5">
                    Create File
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="File Name"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-800 text-white mb-4 outline-none"
                        required
                    />

                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-800 text-white mb-4 outline-none"
                    >
                        <option value="java">Java</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                    </select>

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 rounded-lg"
                        >
                            Create
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default CreateFileModal;