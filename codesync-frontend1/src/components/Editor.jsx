import { useEffect, useRef , useState} from "react";
import Editor from "@monaco-editor/react";
import Console from "./Console"; // 🛠️ Your existing Console component
import { executeCode } from "../services/codeExecutionService";
// Change this line at the top:


import {
    sendCodeUpdate,
    sendCursorPosition
} from "../services/websocket";

import { updateFile } from "../services/fileservice";

let editorInstance = null;

let applyingRemoteUpdate = false;

export const applyRemoteCode = (content) => {

    if (!editorInstance) {
        return;
    }

    const currentContent = editorInstance.getValue();

    if (currentContent === content) {
        return;
    }

    applyingRemoteUpdate = true;

    const position = editorInstance.getPosition();
    const selection = editorInstance.getSelection();

    editorInstance.executeEdits(
        "remote-update",
        [
            {
                range: editorInstance
                    .getModel()
                    .getFullModelRange(),

                text: content
            }
        ]
    );

    // Restore local cursor
    if (position) {

        const model = editorInstance.getModel();

        const maxLine = model.getLineCount();

        const lineNumber = Math.min(
            position.lineNumber,
            maxLine
        );

        const maxColumn =
            model.getLineMaxColumn(lineNumber);

        const column = Math.min(
            position.column,
            maxColumn
        );

        editorInstance.setPosition({
            lineNumber,
            column
        });
    }

    if (selection) {
        editorInstance.setSelection(selection);
    }

    setTimeout(() => {
        applyingRemoteUpdate = false;
    }, 0);
};


function CodeEditor({
    selectedFile,
    projectId,
    remoteCursors = {}
}) {

    const currentFileId = useRef(null);

    const saveTimer = useRef(null);

    const selectedFileRef = useRef(selectedFile);

    const remoteDecorationsRef = useRef(null);

    

const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);

    // 🛠️ ADD THIS FUNCTION HERE
    const handleRunCode = async () => {
        if (!selectedFile || !selectedFile.content) return;
        
        setIsRunning(true);
        setOutput("Executing code...\n");

        try {
            // Note: Monaco stores the latest code in editorInstance.getValue()
            const codeToRun = editorInstance ? editorInstance.getValue() : selectedFile.content;
            const language = selectedFile.language || "java";
            
            const result = await executeCode(language, codeToRun);
            setOutput(result.output);
        } catch (error) {
            setOutput("Execution failed.");
        } finally {
            setIsRunning(false);
        }
    };
    // =====================================
    // KEEP SELECTED FILE UPDATED
    // =====================================

    useEffect(() => {

        selectedFileRef.current =
            selectedFile;

    }, [selectedFile]);


    // =====================================
    // LOAD FILE
    // =====================================

    useEffect(() => {

        if (!editorInstance || !selectedFile) {
            return;
        }

        if (
            currentFileId.current ===
            selectedFile.id
        ) {
            return;
        }

        currentFileId.current =
            selectedFile.id;

        applyingRemoteUpdate = true;

        editorInstance.setValue(
            selectedFile.content || ""
        );

        setTimeout(() => {

            applyingRemoteUpdate = false;

        }, 0);

    }, [selectedFile?.id]);


    // =====================================
    // MONACO MOUNT
    // =====================================

    const handleEditorDidMount = (editor) => {

        editorInstance = editor;

        currentFileId.current =
            selectedFile?.id || null;

        editor.setValue(
            selectedFile?.content || ""
        );


        // =================================
        // CODE CHANGE
        // =================================

        editor.onDidChangeModelContent(
            (event) => {

                if (applyingRemoteUpdate) {
                    return;
                }

                const file =
                    selectedFileRef.current;

                if (!file) {
                    return;
                }

                const content =
                    editor.getValue();


                // =============================
                // SEND CODE TO OTHER USERS
                // =============================

                sendCodeUpdate({

                    projectId:
                        Number(projectId),

                    fileId:
                        file.id,

                    sender:
                        localStorage.getItem("email")
                        || "User",

                    content:
                        content

                });


                // =============================
                // SAVE TO DATABASE
                // =============================

                clearTimeout(
                    saveTimer.current
                );

                saveTimer.current =
                    setTimeout(
                        async () => {

                            try {

                                await updateFile(
                                    file.id,
                                    content
                                );

                                console.log(
                                    "💾 Code saved"
                                );

                            } catch (error) {

                                console.error(
                                    "❌ Save failed:",
                                    error
                                );

                            }

                        },
                        800
                    );

            }
        );


        // =================================
        // LOCAL CURSOR POSITION
        // =================================

        editor.onDidChangeCursorPosition(
            (event) => {

                // Don't broadcast cursor changes
                // caused by remote code updates
                if (applyingRemoteUpdate) {
                    return;
                }

                const position =
                    event?.position;

                const file =
                    selectedFileRef.current;

                if (!position || !file) {
                    return;
                }

                const cursorData = {

                    projectId:
                        Number(projectId),

                    fileId:
                        file.id,

                    username:
                        localStorage.getItem("email")
                        || "User",

                    lineNumber:
                        position.lineNumber,

                    column:
                        position.column

                };

                console.log(
                    "🖱️ Sending cursor:",
                    cursorData
                );

                sendCursorPosition(
                    cursorData
                );

            }
        );

    };


    // =====================================
    // VISUAL REMOTE CURSORS
    // =====================================

    useEffect(() => {

        if (!editorInstance) {
            return;
        }

        const model =
            editorInstance.getModel();

        if (!model) {
            return;
        }


        // Remove previous decorations
        if (remoteDecorationsRef.current) {

            remoteDecorationsRef.current.clear();

            remoteDecorationsRef.current =
                null;
        }


        const currentUser =
            localStorage.getItem("email")
            || "User";


        // Convert object to array
        const cursors =
            Object.values(remoteCursors || {});


        const decorations =
            cursors

                // Don't show our own cursor
                .filter(cursor =>
                    cursor.username !== currentUser
                )

                // Only current project
                .filter(cursor =>
                    Number(cursor.projectId) ===
                    Number(projectId)
                )

                // Only current file
                .filter(cursor =>
                    Number(cursor.fileId) ===
                    Number(selectedFile?.id)
                )

                .map(cursor => {

                    const line =
                        Math.max(
                            1,
                            Math.min(
                                Number(cursor.lineNumber),
                                model.getLineCount()
                            )
                        );

                    const maxColumn =
                        model.getLineMaxColumn(
                            line
                        );

                    const column =
                        Math.max(
                            1,
                            Math.min(
                                Number(cursor.column),
                                maxColumn
                            )
                        );


                    return {

                        range: {

                            startLineNumber:
                                line,

                            startColumn:
                                column,

                            endLineNumber:
                                line,

                            endColumn:
                                column

                        },

                        options: {

                            beforeContentClassName:
                                "remote-cursor",

                            hoverMessage: {

                                value:
                                    `**${cursor.username}** is here`

                            }

                        }

                    };

                });


        remoteDecorationsRef.current =
            editorInstance.createDecorationsCollection(
                decorations
            );


    }, [
        remoteCursors,
        projectId,
        selectedFile?.id
    ]);


    // =====================================
    // CLEANUP
    // =====================================

    useEffect(() => {

        return () => {

            if (saveTimer.current) {

                clearTimeout(
                    saveTimer.current
                );

            }

            if (
                remoteDecorationsRef.current
            ) {

                remoteDecorationsRef.current.clear();

            }

            editorInstance = null;

        };

    }, []);


   return (
        <div className="flex flex-col h-full w-full bg-[#1e1e1e]">
            
            {/* 🛠️ TOP BAR: File Name & Run Button */}
            <div className="flex justify-between items-center bg-slate-900 p-2 border-b border-slate-700 shadow-sm">
                <span className="text-slate-300 text-sm ml-2 font-mono">
                    {selectedFile?.fileName || "Untitled"}
                </span>
                
                <button 
                    onClick={handleRunCode}
                    disabled={isRunning || !selectedFile}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-1.5 rounded flex items-center gap-2 text-xs font-bold transition-colors"
                >
                    {isRunning ? "⏳ Running..." : "▶ Run Code"}
                </button>
            </div>

            {/* 🛠️ MIDDLE: Monaco Editor Area */}
            <div className="flex-1 overflow-hidden relative">
                <Editor
                    height="100%"
                    theme="vs-dark"
                    defaultLanguage={selectedFile?.language?.toLowerCase() || "java"}
                    defaultValue={selectedFile?.content || ""}
                    onMount={handleEditorDidMount}
                    options={{
                        automaticLayout: true,
                        minimap: { enabled: false },
                        fontSize: 15,
                        wordWrap: "on"
                    }}
                />
            </div>

            {/* 🛠️ BOTTOM: The Output Console */}
            <Console output={output} />
            
        </div>
    );
}

export default CodeEditor;