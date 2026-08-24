import { FaTimes } from "react-icons/fa";
import { getFileIcon } from "./FileExplorer"; // 🛠️ Import our new icon helper!

function EditorTabs({ openTabs, activeTab, setActiveTab, setSelectedFile, closeTab }) {
    
    if (openTabs.length === 0) return null;

    return (
        <div className="flex bg-slate-900 overflow-x-auto border-b border-slate-800 no-scrollbar">
            {openTabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                    <div 
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setSelectedFile(tab);
                        }}
                        // 🛠️ The VS Code Tab styling (Top border highlights active tab)
                        className={`
                            group flex items-center gap-3 px-4 py-2 cursor-pointer 
                            border-t-2 border-r border-r-slate-800 text-sm min-w-[120px] max-w-[200px]
                            transition-colors
                            ${isActive 
                                ? "bg-[#1e1e1e] border-t-indigo-500 text-white" 
                                : "bg-slate-900 border-t-transparent text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                            }
                        `}
                    >
                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                            {getFileIcon(tab.fileName)}
                            <span className="truncate whitespace-nowrap">{tab.fileName}</span>
                        </div>

                        {/* 🛠️ The close 'X' button only appears when you hover the tab */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                closeTab(tab.id);
                            }}
                            className={`
                                p-1 rounded transition-all
                                ${isActive ? "opacity-100 hover:bg-slate-700" : "opacity-0 group-hover:opacity-100 hover:bg-slate-700"}
                            `}
                        >
                            <FaTimes size={10} className={isActive ? "text-slate-300" : "text-slate-400"} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default EditorTabs;