import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { disconnectWebSocket } from "../services/websocket";

function UserProfile() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Safely get the user's email from localStorage
    const email = localStorage.getItem("email") || "User";
    
    // Get the first letter of the email to use as an avatar
    const initial = email.charAt(0).toUpperCase();

    // Close the dropdown if the user clicks anywhere outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        // 1. Clear the security tokens from the browser
        localStorage.removeItem("token");
        localStorage.removeItem("email");

        // 2. Safely disconnect WebSockets so they don't stay active in the background
        disconnectWebSocket();

        // 3. Redirect back to the login page
        navigate("/login"); // Change this to "/" if your login page is at the root!
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm hover:bg-indigo-500 transition-colors focus:outline-none ring-2 ring-transparent focus:ring-indigo-400"
            >
                {initial}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-md shadow-lg border border-slate-700 z-50 overflow-hidden">
                    {/* Header showing email */}
                    <div className="px-4 py-3 bg-slate-900 border-b border-slate-700">
                        <p className="text-sm text-slate-400">Logged in as</p>
                        <p className="text-sm font-medium text-white truncate">{email}</p>
                    </div>

                    {/* Actions */}
                    <div className="py-1">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors flex items-center gap-2"
                        >
                            <span>🚪</span> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;