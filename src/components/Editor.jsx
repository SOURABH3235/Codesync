import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { updateFile } from "../services/fileService";

function CodeEditor({ selectedFile }) {

    const [code, setCode] = useState("");

    useEffect(() => {

        if (selectedFile) {
            setCode(selectedFile.content);
        }

    }, [selectedFile]);

    useEffect(() => {

        if (!selectedFile) return;

        const timer = setTimeout(() => {

            updateFile(selectedFile.id, code)
                .then(() => console.log("Saved"))
                .catch(console.error);

        }, 1000);

        return () => clearTimeout(timer);

    }, [code]);

    return (
        <Editor
            height="100%"
            language={selectedFile?.language || "java"}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
        />
    );
}

export default CodeEditor;