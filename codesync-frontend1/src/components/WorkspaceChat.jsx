import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { subscribeChat, sendChatMessage } from "../services/websocket";

function WorkspaceChat({ projectId, currentUserEmail }) {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const messagesEndRef = useRef(null);

    // Auto-scroll to the newest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 🛠️ FETCH HISTORY & SUBSCRIBE TO LIVE MESSAGES
    useEffect(() => {
        let subscription = null;
        let timer = null;

        // 1. Fetch the chat history from the database
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:8080/api/projects/${projectId}/chat`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Format the timestamps so they look nice in the UI
                const history = response.data.map(msg => ({
                    sender: msg.sender,
                    message: msg.message,
                    localTime: new Date(msg.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })
                }));
                
                setMessages(history);
            } catch (error) {
                console.error("Failed to load chat history:", error);
            }
        };

        fetchHistory();

        // 2. Subscribe to live messages (with a slight delay to ensure connection)
        timer = setTimeout(() => {
            subscription = subscribeChat(projectId, (receivedMessage) => {
                // Generate a local timestamp for the UI
                receivedMessage.localTime = new Date().toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                setMessages((prev) => [...prev, receivedMessage]);
            });
        }, 1000);

        // 3. Cleanup function when component unmounts
        return () => {
            if (timer) clearTimeout(timer);
            if (subscription) subscription.unsubscribe();
        };
    }, [projectId]);

    const sendMessage = (e) => {
        e.preventDefault();
        
        if (messageInput.trim()) {
            const chatMessage = {
                projectId: Number(projectId),
                sender: currentUserEmail,
                message: messageInput.trim(),
            };

            // Use your service to send the message
            sendChatMessage(projectId, chatMessage);
            setMessageInput(""); // Clear input
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 w-full">
            {/* Header */}
            <div className="p-3 border-b border-slate-700 bg-slate-800">
                <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                    <span>💬</span> Workspace Chat
                </h3>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-600">
                {messages.length === 0 ? (
                    <div className="text-slate-500 text-xs text-center mt-10">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender === currentUserEmail;
                        return (
                            <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                <span className="text-[10px] text-slate-400 mb-1">
                                    {isMe ? "You" : msg.sender.split("@")[0]} • {msg.localTime}
                                </span>
                                <div className={`px-2 py-1.5 rounded-md text-xs max-w-[90%] break-words shadow-sm ${
                                    isMe 
                                    ? "bg-indigo-600 text-white rounded-br-none" 
                                    : "bg-slate-700 text-slate-200 rounded-bl-none"
                                }`}>
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-2 bg-slate-800 border-t border-slate-700 flex gap-2">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-900 text-white text-xs px-2 py-1.5 rounded border border-slate-600 focus:outline-none focus:border-indigo-500"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-3 py-1.5 rounded transition-colors text-xs font-medium"
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default WorkspaceChat;