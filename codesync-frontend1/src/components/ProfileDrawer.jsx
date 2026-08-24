import { useEffect, useState } from "react";

function ProfileDrawer({ isOpen, onClose, userEmail, projectCount }) {
    // 🛠️ ADD THEME STATE
    const [isDarkMode, setIsDarkMode] = useState(true);

    const emailPrefix = userEmail && userEmail.includes("@") 
        ? userEmail.split("@")[0] 
        : "Guest";
        
    const handle = `@${emailPrefix}`;
    const displayName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

    // Prevent background scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // 🛠️ LOAD SAVED THEME ON MOUNT
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        } else {
            // Default to dark mode
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    // 🛠️ TOGGLE THEME FUNCTION
    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.clear(); 
        window.location.href = "/";
    };

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="fixed top-0 right-0 h-full w-[400px] max-w-full bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col overflow-y-auto animate-slide-in-right">
                
                <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950/50">
                    <h2 className="text-white font-bold text-lg">Profile</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800">
                        ✕
                    </button>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    
                    <div className="flex flex-col items-center mb-8 mt-2">
                        <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-4xl text-white font-bold mb-4 shadow-[0_0_20px_rgba(79,70,229,0.3)] ring-4 ring-slate-800">
                            {displayName.charAt(0)}
                        </div>
                        <h3 className="text-2xl text-white font-bold">{displayName}</h3>
                        <p className="text-indigo-400 text-sm font-medium mt-1">{handle}</p>
                        <p className="text-slate-400 text-sm mt-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">CodeSync Developer</p>
                    </div>

                    <hr className="border-slate-800 mb-8" />

                    <div className="mb-8">
                        <h4 className="text-slate-300 text-sm font-bold flex items-center gap-2 mb-4 uppercase tracking-wider">
                            <span>📊</span> Coding Statistics
                        </h4>
                        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 flex flex-col items-center justify-center transition-all hover:bg-slate-800">
                            <p className="text-sm text-slate-400 mb-2">Total Projects Created</p>
                            <p className="text-4xl font-black text-white">{projectCount || 0}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-slate-300 text-sm font-bold flex items-center gap-2 mb-4 uppercase tracking-wider">
                            <span>⚙️</span> Account Settings
                        </h4>
                        <div className="space-y-2">
                            <button className="w-full text-left px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent hover:border-slate-700 transition-all flex items-center gap-3">
                                <span className="text-lg">🔐</span> Change Password
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent hover:border-slate-700 transition-all flex items-center gap-3">
                                <span className="text-lg">🔔</span> Notifications
                            </button>
                            
                            {/* 🛠️ THE NEW THEME TOGGLE BUTTON */}
                            <button 
                                onClick={toggleTheme}
                                className="w-full text-left px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent hover:border-slate-700 transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{isDarkMode ? "🌙" : "☀️"}</span> 
                                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                                </div>
                                {/* A small visual toggle switch */}
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${isDarkMode ? 'left-5.5' : 'left-0.5'}`} style={{ left: isDarkMode ? '22px' : '2px' }}></div>
                                </div>
                            </button>

                            <button className="w-full text-left px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent hover:border-slate-700 transition-all flex items-center gap-3">
                                <span className="text-lg">🔒</span> Privacy
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-800">
                        <button 
                            onClick={handleLogout}
                            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        >
                            <span className="text-lg">🚪</span> Logout
                        </button>
                    </div>
                    
                </div>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </>
    );
}

export default ProfileDrawer;