import { useEffect, useState } from "react";
import { FaFolderOpen, FaPlus } from "react-icons/fa";
import { getProjects ,createProject ,deleteProject } from "../services/projectService";
import CreateProjectModal from "../components/CreateProjectModal";
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };
const handleCreateProject = async (project) => {
  try {
    const response = await createProject(project);

    console.log("Project created:", response);

    setShowModal(false);
    fetchProjects();
  } catch (error) {
    console.log(error);
    console.log(error.response);
    console.log(error.response?.status);
    console.log(error.response?.data);

    alert("Failed to create project");
  }
};
const handleDeleteProject = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {

        await deleteProject(id);

        fetchProjects();

    } catch (error) {

        console.error(error);

        alert("Failed to delete project");

    }

};

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-blue-500">CodeSync</h1>

       <button
    onClick={() => setShowModal(true)}
    className="bg-blue-600 px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700"
>
    <FaPlus />
    New Project
    
</button>
      </nav>

      {/* Projects */}
      <div className="p-8">
        {loading ? (
          <h2 className="text-center text-gray-400 text-lg">
            Loading Projects...
          </h2>
        ) : projects.length === 0 ? (
          <div className="text-center mt-20">
            <FaFolderOpen className="text-7xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">No Projects Found</h2>
            <p className="text-gray-400 mt-2">
              Click "New Project" to create your first project.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
  key={project.id}
  onClick={() => navigate(`/workspace/${project.id}`)}
  className="bg-slate-900 rounded-xl p-6 hover:bg-slate-800 transition duration-300 cursor-pointer"
>
                <FaFolderOpen className="text-5xl text-blue-500" />

                <h2 className="mt-5 text-xl font-semibold">
                  {project.projectName}
                </h2>

                <p className="text-gray-400 mt-2">
                  {project.description || "No description"}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal && (
  <CreateProjectModal
    onClose={() => setShowModal(false)}
    onCreate={handleCreateProject}
  />
)}
    </div>
  );
}

export default Dashboard;