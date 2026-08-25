import { useState } from "react";

import ShareProjectModal from "./ShareProjectModal";


function WorkspaceNavbar( { projectId, projectName ,onToggleLeft, onToggleRight }) {
    
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

   return (
        <>
            <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 sm:px-4">
                
                {/* 📱 LEFT SIDE: Mobile Menu Toggle + Project Name */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onToggleLeft}
                        className="lg:hidden text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                    >
                        {/* Hamburger Icon */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    
                    <div className="text-white font-bold text-base sm:text-lg truncate max-w-[150px] sm:max-w-xs">
                        {projectName || "Loading..."}
                    </div>
                </div>

                {/* 📱 RIGHT SIDE: Share + Mobile Chat Toggle */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <button 
                        onClick={() => setIsShareModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors"
                    >
                        Share
                    </button>
                    
                    <button 
                        onClick={onToggleRight}
                        className="lg:hidden text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                    >
                        {/* Chat Icon */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </button>
                </div>
            </div>

            {isShareModalOpen && (
                <ShareProjectModal 
                    projectId={projectId} 
                    onClose={() => setIsShareModalOpen(false)} 
                />
            )}
        </>
    );
}


export default WorkspaceNavbar;