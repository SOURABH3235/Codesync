import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import WorkspaceChat from "../components/WorkspaceChat";
import { getProject } from "../services/projectService";
import {
    connectWebSocket,
    disconnectWebSocket,
    subscribeWorkspace,
    subscribePresence,
    subscribeCursor,
    sendPresence,
   
} from "../services/websocket";

import WorkspaceNavbar from "../components/WorkspaceNavbar";
import FileExplorer from "../components/FileExplorer";
import CodeEditor from "../components/Editor";
import RightSidebar from "../components/RightSidebar";
import EditorTabs from "../components/EditorTabs";

import CreateFileModal from "../components/CreateFileModal";
import RenameFileModal from "../components/RenameFileModal";
import { applyRemoteCode } from "../components/Editor";
import OnlineUsers from "../components/OnlineUsers";

import {
    getFiles,
    getFile,
    createFile,
    deleteFile,
    renameFile
} from "../services/fileService";

function Workspace() {

    const { projectId } = useParams();
const [projectDetails, setProjectDetails] = useState(null);
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

    // 🛠️ FIX 1: Added a ref to prevent stale closures in WebSocket callbacks
    const selectedFileRef = useRef(selectedFile);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);

    const [renameFileData, setRenameFileData] = useState(null);

    const [openTabs, setOpenTabs] = useState([]);
    const [activeTab, setActiveTab] = useState(null);

    const [stompClient, setStompClient] = useState(null);

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [remoteCursors, setRemoteCursors] = useState({});
// 🛠️ FIX 1: Safely decode the token to find out exactly who is logged in!
    const currentUserEmail = (() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) return storedEmail;

        const token = localStorage.getItem("token");
        if (token) {
            try {
                // Decode the middle part of the JWT token (the payload)
                const payload = JSON.parse(atob(token.split('.')[1]));
                // Spring Boot usually puts the username/email in the "sub" (subject) field
                return payload.sub || payload.username || payload.email || "Unknown";
            } catch (error) {
                console.error("Failed to decode token", error);
            }
        }
        return "Unknown";
    })();
    // 🛠️ FIX 1: Keep the ref perfectly in sync with the state
    useEffect(() => {
        selectedFileRef.current = selectedFile;
    }, [selectedFile]);


    useEffect(() => {
        loadFiles();
    }, [projectId]);


    useEffect(() => {

        let workspaceSubscription = null;
        let presenceSubscription = null;
        let cursorSubscription = null;

        connectWebSocket(() => {

            console.log("✅ WebSocket Connected");

            // -------------------------
            // Code updates
            // -------------------------

            workspaceSubscription = subscribeWorkspace(
                projectId,
                (data) => {

                    console.log("📡 Code update:", data);

                    if (!data || !data.fileId) {
                        return;
                    }

                    // 🛠️ FIX 1: Use the ref instead of the state to get the LATEST file
                    const currentFile = selectedFileRef.current;

                    if (
                        currentFile &&
                        currentFile.id === data.fileId
                    ) {
                        applyRemoteCode(data.content);
                    }

                }
            );

            // -------------------------
            // Cursor updates
            // -------------------------
            cursorSubscription = subscribeCursor(
                projectId,
                (data) => {

                    console.log("🖱️ Remote cursor:", data);

                    if (!data) {
                        return;
                    }

                    // Ignore our own cursor
                    const currentUser =
                        localStorage.getItem("email") || "User";

                    if (data.username === currentUser) {
                        return;
                    }

                    setRemoteCursors(prev => ({
                        ...prev,
                        [data.username]: data
                    }));

                }
            );

            // -------------------------
            // Presence updates
            // -------------------------
            presenceSubscription = subscribePresence(
                projectId,
                (data) => {
                    console.log("👤 Presence:", data);
                    if (!data) return;

                    setOnlineUsers(prev => {
                        // 🛠️ FIX: Handle both JOIN and our new PRESENT status
                        if (data.status === "JOIN" || data.status === "PRESENT") {
                            
                            // 🚀 THE MAGIC TRICK: 
                            // If someone ELSE just joined, announce that YOU are already here!
                            // (We use "PRESENT" instead of "JOIN" so they don't get stuck in an infinite loop shouting at each other)
                            if (data.status === "JOIN" && data.username !== currentUserEmail) {
                                sendPresence({
                                    projectId: Number(projectId),
                                    username: currentUserEmail,
                                    status: "PRESENT" 
                                });
                            }

                            // Add them to the list if they aren't already on it
                            if (prev.includes(data.username)) {
                                return prev;
                            }
                            return [...prev, data.username];
                        }

                        if (data.status === "LEAVE") {
                            return prev.filter(user => user !== data.username);
                        }

                        return prev;
                    });
                }
            );

            // -------------------------
            // Tell server we joined
            // -------------------------

            sendPresence({
                projectId: Number(projectId),
                username: currentUserEmail, // 🛠️ FIX 2: Use the real email here!
                status: "JOIN"
            });

        });

        return () => {

            // Tell other users we are leaving
            sendPresence({
                projectId: Number(projectId),
                username: currentUserEmail, // 🛠️ FIX 2: Use the real email here too!
                status: "LEAVE"
            });

            if (workspaceSubscription) {
                workspaceSubscription.unsubscribe();
            }

            if (presenceSubscription) {
                presenceSubscription.unsubscribe();
            }

            // 🛠️ FIX 2: Correctly unsubscribe from cursors ONLY when leaving the component
            if (cursorSubscription) {
                cursorSubscription.unsubscribe();
            }

            disconnectWebSocket();

        };

    // Note: We removed selectedFile?.id from dependencies so the WebSocket doesn't disconnect on file change
    }, [projectId]); 


    // ---------------- LOAD FILES ----------------

  // ---------------- LOAD FILES ----------------
    const loadFiles = async () => {
        try {
            setLoading(true);
            setError("");

            // 🛠️ 2. Fetch the project details (like the name!)
            try {
                // Change getProject to whatever your fetch function is called!
                const projectData = await getProject(projectId); 
                setProjectDetails(projectData);
            } catch (pErr) {
                console.error("Could not load project details", pErr);
            }

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
        <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
            <WorkspaceNavbar 
                projectId={projectId} 
                projectName={projectDetails?.projectName || "CodeSync Workspace"}
                onToggleLeft={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                onToggleRight={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            />

            <div className="flex flex-1 overflow-hidden relative">
                
                {/* 📱 Mobile Overlay for Left Sidebar */}
                {isLeftSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
                        onClick={() => setIsLeftSidebarOpen(false)}
                    />
                )}

                {/* 📁 Left Sidebar (File Explorer) */}
                <div className={`
                    absolute lg:relative z-40 h-full w-72 bg-slate-900 border-r border-slate-800 
                    transform transition-transform duration-300 ease-in-out flex-shrink-0
                    ${isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}>
                    <FileExplorer
                        files={files}
                        selectedFile={selectedFile}
                        openFile={(id) => {
                            openFile(id);
                            // Auto-close the sidebar on mobile after clicking a file!
                            if (window.innerWidth < 1024) setIsLeftSidebarOpen(false); 
                        }}
                        onCreateFile={() => setShowCreateModal(true)}
                        onDeleteFile={handleDeleteFile}
                        onRenameFile={(file) => {
                            setRenameFileData(file);
                            setShowRenameModal(true);
                        }}
                    />
                </div>

                {/* 💻 Middle (Code Editor) */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
                    <EditorTabs
                        openTabs={openTabs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setSelectedFile={setSelectedFile}
                        closeTab={closeTab}
                    />
                    
                    <div className="flex-1 relative">
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
                                    projectId={projectId}
                                    remoteCursors={remoteCursors}
                                />
                            ) : (
                                <div className="h-full flex justify-center items-center text-gray-400">
                                    No File Selected
                                </div>
                            )
                        }
                    </div>
                </div>

                {/* 📱 Mobile Overlay for Right Sidebar */}
                {isRightSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
                        onClick={() => setIsRightSidebarOpen(false)}
                    />
                )}

                {/* 💬 Right Sidebar Area (Users + Chat) */}
                <div className={`
                    absolute right-0 lg:relative z-40 h-full w-80 bg-slate-900 border-l border-slate-800 
                    flex flex-col transform transition-transform duration-300 ease-in-out flex-shrink-0
                    ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
                `}>
                    
                    {/* Top half: Online Users */}
                    <div className="flex-shrink-0">
                        <OnlineUsers users={onlineUsers} />
                    </div>

                    {/* Bottom half: Real-Time Chat */}
                    <div className="flex-1 overflow-hidden">
                        <WorkspaceChat 
                            projectId={projectId} 
                            currentUserEmail={currentUserEmail} 
                            stompClient={stompClient} 
                        />
                    </div>
                </div>
            </div>
            
            {/* Modals */}
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