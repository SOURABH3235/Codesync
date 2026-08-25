import api from "./api";
import axios from "axios";

// Get all projects
export const getProjects = async () => {

    const token = localStorage.getItem("token");

    const response = await api.get("/projects", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Create project
export const createProject = async (project) => {

    const token = localStorage.getItem("token");

    const response = await api.post("/projects", project, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Get single project
export const getProject = async (id) => {

    const token = localStorage.getItem("token");

    const response = await api.get(`/projects/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Update project
export const updateProject = async (id, project) => {

    const token = localStorage.getItem("token");

    const response = await api.put(`/projects/${id}`, project, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Delete project
export const deleteProject = async (id) => {

    const token = localStorage.getItem("token");

    await api.delete(`/projects/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
// 🛠️ ADD THIS FUNCTION: Calls the new share endpoint


export const shareProject = async (projectId, email) => {
    try {
        // 1. Get the token (Check your Application tab in F12 to ensure this key matches what you use, e.g., "token" or "jwt")
        const token = localStorage.getItem("token"); 
        
        // 2. Debug logs - we will check this in the console!
        console.log("=== SHARE PROJECT DEBUG ===");
        console.log(
  "URL:",
  `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/share`
);
        console.log("TOKEN:", token); 
        console.log("===========================");

        if (!token) {
            throw "No token found! You are not logged in properly.";
        }

        // 3. Send the request with forced headers
       const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/share`,
            { email: email },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("BACKEND ERROR RESPONSE:", error.response);
        
        if (error.response && error.response.data) {
            throw typeof error.response.data === "string" 
                ? error.response.data 
                : error.response.data.message || "Forbidden: Invalid Token";
        }
        throw typeof error === "string" ? error : "Failed to share project.";
    }
};
