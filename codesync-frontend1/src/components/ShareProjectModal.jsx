import { useState } from "react";
import { shareProject } from "../services/projectService"; // Adjust path if needed

function ShareProjectModal({ projectId, onClose }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleShare = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            await shareProject(projectId, email);
            setMessage(`Successfully shared with ${email}!`);
            setTimeout(() => onClose(), 2000); // Close after 2 seconds
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-96 border border-slate-700">
                <h2 className="text-xl font-bold text-white mb-4">Share Project</h2>
                
                <form onSubmit={handleShare}>
                    <div className="mb-4">
                        <label className="block text-slate-300 text-sm font-bold mb-2">
                            Collaborator Email
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full p-2 bg-slate-900 text-white border border-slate-600 rounded focus:outline-none focus:border-emerald-500"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {message && <p className="text-emerald-500 text-sm mb-4">{message}</p>}
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors disabled:opacity-50"
                            disabled={loading || !email}
                        >
                            {loading ? "Sharing..." : "Share"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ShareProjectModal;