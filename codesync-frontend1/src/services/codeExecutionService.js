import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const executeCode = async (language, sourceCode) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            `${API_URL}/code/execute`,
            {
                language,
                sourceCode
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token && {
                        Authorization: `Bearer ${token}`
                    })
                }
            }
        );

        return {
            success: response.data.success,
            output: response.data.output
        };

    } catch (error) {
        console.error("Execution error:", error);

        return {
            success: false,
            output:
                error.response?.data?.message ||
                "Unable to connect to CodeSync server."
        };
    }
};