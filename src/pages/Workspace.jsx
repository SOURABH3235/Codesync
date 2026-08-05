import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import WorkspaceNavbar from "../components/WorkspaceNavbar";
import FileExplorer from "../components/FileExplorer";
import CodeEditor from "../components/Editor";
import RightSidebar from "../components/RightSidebar";
import EditorTabs from "../components/EditorTabs";

import CreateFileModal from "../components/CreateFileModal";
import RenameFileModal from "../components/RenameFileModal";

import {
    getFiles,
    getFile,
    createFile,
    deleteFile,
    renameFile
} from "../services/fileService";

function Workspace() {

    const { projectId } = useParams();

    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);

    const [renameFileData, setRenameFileData] = useState(null);

    const [openTabs, setOpenTabs] = useState([]);
    const [activeTab, setActiveTab] = useState(null);

    useEffect(() => {

        loadFiles();

    }, [projectId]);

    // ---------------- LOAD FILES ----------------

    const loadFiles = async () => {

        try {

            setLoading(true);
            setError("");

            const projectFiles = await getFiles(projectId);

            setFiles(projectFiles);

            if (projectFiles.length > 0) {

                const file = await getFile(projectFiles[0].id);

                setSelectedFile(file);

                setOpenTabs([file]);

                setActiveTab(file.id);

            } else {

                setSelectedFile(null);
                setOpenTabs([]);
                setActiveTab(null);

            }

        } catch (err) {

            console.error(err);

            setError("Failed to load project files.");

        } finally {

            setLoading(false);

        }

    };

    // ---------------- OPEN FILE ----------------

    const openFile = async (id) => {

        try {

            const file = await getFile(id);

            setSelectedFile(file);

            setActiveTab(file.id);

            setOpenTabs(prev => {

                if (prev.some(tab => tab.id === file.id)) {
                    return prev;
                }

                return [...prev, file];

            });

        } catch (error) {

            console.error(error);

        }

    };

    // ---------------- CREATE FILE ----------------

    const handleCreateFile = async (file) => {

        try {

            const newFile = await createFile({

                projectId,

                fileName: file.fileName,

                language: file.language,

                content:
`public class Main {

    public static void main(String[] args) {

    }

}`

            });

            await loadFiles();

            const openedFile = await getFile(newFile.id);

            setSelectedFile(openedFile);

            setOpenTabs(prev => [...prev, openedFile]);

            setActiveTab(openedFile.id);

            setShowCreateModal(false);

        } catch (error) {

            console.error(error);

            alert("Failed to create file");

        }

    };

    // ---------------- DELETE FILE ----------------

    const handleDeleteFile = async (id) => {

        if (!window.confirm("Delete this file?")) return;

        try {

            await deleteFile(id);

            await loadFiles();

        } catch (error) {

            console.error(error);

            alert("Delete failed");

        }

    };

    // ---------------- RENAME FILE ----------------

    const handleRenameFile = async (id, name) => {

        try {

            await renameFile(id, name);

            await loadFiles();

            setShowRenameModal(false);

        } catch (error) {

            console.error(error);

            alert("Rename failed");

        }

    };

    // ---------------- CLOSE TAB ----------------

    const closeTab = (id) => {

        const tabs = openTabs.filter(tab => tab.id !== id);

        setOpenTabs(tabs);

        if (activeTab === id) {

            if (tabs.length > 0) {

                setSelectedFile(tabs[0]);

                setActiveTab(tabs[0].id);

            } else {

                setSelectedFile(null);

                setActiveTab(null);

            }

        }

    };

    return (

        <div className="h-screen flex flex-col bg-slate-950">

            <WorkspaceNavbar />

            <div className="flex flex-1 overflow-hidden">

                <FileExplorer
                    files={files}
                    selectedFile={selectedFile}
                    openFile={openFile}
                    onCreateFile={() => setShowCreateModal(true)}
                    onDeleteFile={handleDeleteFile}
                    onRenameFile={(file) => {

                        setRenameFileData(file);

                        setShowRenameModal(true);

                    }}
                />

                <div className="flex-1 flex flex-col">

                    <EditorTabs
                        openTabs={openTabs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setSelectedFile={setSelectedFile}
                        closeTab={closeTab}
                    />

                    <div className="flex-1">

                        {
                            loading ? (

                                <div className="h-full flex justify-center items-center text-white">
                                    Loading...
                                </div>

                            ) : error ? (

                                <div className="h-full flex justify-center items-center text-red-500">
                                    {error}
                                </div>

                            ) : selectedFile ? (

                                <CodeEditor
                                    selectedFile={selectedFile}
                                />

                            ) : (

                                <div className="h-full flex justify-center items-center text-gray-400">
                                    No File Selected
                                </div>

                            )
                        }

                    </div>

                </div>

                <RightSidebar />

            </div>

            {

                showCreateModal && (

                    <CreateFileModal
                        onClose={() => setShowCreateModal(false)}
                        onCreate={handleCreateFile}
                    />

                )

            }

            {

                showRenameModal && (

                    <RenameFileModal
                        file={renameFileData}
                        onClose={() => setShowRenameModal(false)}
                        onRename={handleRenameFile}
                    />

                )

            }

        </div>

    );

}

export default Workspace;