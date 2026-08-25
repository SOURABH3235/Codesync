import { useEffect, useState, useCallback } from "react";
import { FaFolderOpen, FaPlus } from "react-icons/fa";
import { getProjects, createProject, deleteProject } from "../services/projectService";
import CreateProjectModal from "../components/CreateProjectModal";
import { useNavigate } from "react-router-dom";
import ProfileDrawer from "../components/ProfileDrawer";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  // Profile State & Identity setup
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Decode the token to get the REAL email!
  const getUserData = () => {
      let email = localStorage.getItem("email");
      
      // If email isn't in localStorage, let's extract it from the JWT token!
      if (!email || email === "user@example.com") {
          const token = localStorage.getItem("token");
          if (token) {
              try {
                  const payload = JSON.parse(atob(token.split('.')[1]));
                  // Spring Boot usually stores the email in 'sub'
                  email = payload.sub || payload.username || payload.email || "Guest";
              } catch (error) {
                  console.error("Could not decode token", error);
                  email = "Guest";
              }
          } else {
              email = "Guest";
          }
      }
      return email;
  };

  const userEmail = getUserData();
  const emailPrefix = userEmail.split("@")[0];
  const displayName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  const handle = `@${emailPrefix}`;
    
  // Fetch projects wrapped in useCallback
  const fetchProjects = useCallback(async () => {
      try {
          const data = await getProjects();
          setProjects(data);
      } catch (error) {
          console.error("Error loading projects:", error);
      } finally {
          setLoading(false);
      }
  }, []); 

  // Safely call fetchProjects on page load
  useEffect(() => {
        const loadInitialData = async () => {
            await fetchProjects();
        };
        
        loadInitialData();
    }, [fetchProjects]);

  const handleCreateProject = async (project) => {
    try {
      const response = await createProject(project);
      console.log("Project created:", response);
      setShowModal(false);
      await fetchProjects();
    } catch (error) {
      console.error(error);
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
      await fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to delete project");
    }
  };

  return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col overflow-x-hidden transition-colors duration-300">
      
      {/* Navbar with proper Light/Dark mode transitions */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-500">CodeSync</h1>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            <FaPlus />
            New Project
          </button>

          {/* User Profile Button */}
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-left"
          >
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{displayName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{handle}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {displayName.charAt(0)}
            </div>
          </button>
        </div>
      </nav>

      {/* Projects Area */}
      <div className="p-8 flex-1">
        {loading ? (
          <h2 className="text-center text-slate-500 dark:text-slate-400 text-lg">
            Loading Projects...
          </h2>
        ) : projects.length === 0 ? (
          <div className="text-center mt-20">
            <FaFolderOpen className="text-7xl text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">No Projects Found</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Click "New Project" to create your first project.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/workspace/${project.id}`)}
                // Dynamic styling for Project Cards
                className="bg-white dark:bg-slate-900 rounded-xl p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition duration-300 cursor-pointer flex flex-col h-full border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md"
              >
                <FaFolderOpen className="text-5xl text-blue-500" />

                <h2 className="mt-5 text-xl font-semibold truncate text-slate-900 dark:text-white">
                  {project.projectName}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 mt-2 flex-1 line-clamp-2">
                  {project.description || "No description"}
                </p>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  className="mt-4 bg-red-50 dark:bg-red-600/20 hover:bg-red-100 dark:hover:bg-red-600/40 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/30 py-2 px-4 rounded-lg transition-colors font-medium self-start"
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

      <ProfileDrawer 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        userEmail={userEmail}
        projectCount={projects.length} 
      />

    </div>
  );
}

export default Dashboard;