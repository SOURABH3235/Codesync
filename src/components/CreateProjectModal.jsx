import { useState } from "react";

function CreateProjectModal({ onClose, onCreate }) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onCreate({
      projectName,
      description,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="bg-slate-900 w-96 rounded-xl p-6">

        <h2 className="text-2xl font-bold text-white mb-5">
          Create Project
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 text-white mb-4 outline-none"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 text-white mb-4 outline-none"
            rows="4"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              Create
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default CreateProjectModal;