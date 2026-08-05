import api from "./api";

// Get all files of a project
export const getFiles = async (projectId) => {
    const token = localStorage.getItem("token");

    const response = await api.get(`/files/project/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Get single file
export const getFile = async (fileId) => {
    const token = localStorage.getItem("token");

    const response = await api.get(`/files/${fileId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Create file
export const createFile = async (file) => {
    const token = localStorage.getItem("token");

    const response = await api.post(`/files`, file, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        
    });

    return response.data;
};

// Update file
export const updateFile = async (fileId, content) => {
    const token = localStorage.getItem("token");

    const response = await api.put(
        `/files/${fileId}`,
        {
            content,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};
export const renameFile = async (fileId, fileName) => {

    const token = localStorage.getItem("token");

    const response = await api.put(
        `/files/${fileId}/rename`,
        {
            fileName
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// Delete file
export const deleteFile = async (fileId) => {
    const token = localStorage.getItem("token");

    await api.delete(`/files/${fileId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};