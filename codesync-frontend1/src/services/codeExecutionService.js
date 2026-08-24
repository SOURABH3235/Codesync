import axios from "axios";

// 🛠️ PASTE YOUR JDOODLE CREDENTIALS HERE
const CLIENT_ID = "8641527f4e07ddc915609ff3da4f42a9";
const CLIENT_SECRET = "28b4e7b8c3bf5f25c9da06d66ae2c3d5ab24980a59bcd6d8d626ab824de633e";

export const executeCode = async (language, sourceCode) => {
    // JDoodle uses specific language identifiers and version indexes
    const langMap = {
        javascript: { lang: "nodejs", version: "4" }, // Node.js 17
        python: { lang: "python3", version: "4" },    // Python 3.9
        java: { lang: "java", version: "4" },         // Java 17
        cpp: { lang: "cpp17", version: "0" },         // C++ 17
        c: { lang: "c", version: "5" }                // C
    };

    const config = langMap[language.toLowerCase()] || langMap["javascript"];

    try {
        // 🛠️ We use corsproxy.io to allow React to securely talk to JDoodle without CORS errors
        const response = await axios.post("https://corsproxy.io/?https://api.jdoodle.com/v1/execute", {
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            script: sourceCode,
            language: config.lang,
            versionIndex: config.version
        });

        const data = response.data;

        // JDoodle returns statusCode 200 for successful compilation (even if the code itself throws a Java error)
        return {
            success: data.statusCode === 200,
            output: data.output || "Program executed successfully with no output."
        };
        
    } catch (error) {
        console.error("Execution error:", error);
        return {
            success: false,
            output: "System Error: Could not reach the JDoodle API. Please check your credentials."
        };
    }
};