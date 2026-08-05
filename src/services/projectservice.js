import api from "./api";

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