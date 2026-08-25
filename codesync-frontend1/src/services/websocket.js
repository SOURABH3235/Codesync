import { Client } from "@stomp/stompjs";


let stompClient = null;

export const connectWebSocket = (onConnected) => {
    // 1. Fetch the JWT token from storage
    const token = localStorage.getItem("token");

    stompClient = new Client({
        brokerURL: import.meta.env.VITE_WS_URL,
        reconnectDelay: 5000,
        
        // 🛠️ FIX 1: Pass the JWT in the STOMP CONNECT frame
        connectHeaders: {
            Authorization: `Bearer ${token}`
        },

        onConnect: () => {
            console.log("✅ WebSocket Connected");
            if (onConnected) {
                onConnected();
            }
        },
        onStompError: (frame) => {
            console.error("STOMP Error:", frame);
        },
        // Helpful for debugging STOMP frame issues
        debug: (str) => {
            console.log("STOMP: " + str);
        }
    });

    stompClient.activate();
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null; // Clean up the reference
    }
};

export const subscribeWorkspace = (projectId, callback) => {
    // Ensure client exists AND is actually connected before subscribing
    if (!stompClient || !stompClient.connected) {
        console.error("Cannot subscribe: WebSocket is not connected.");
        return null;
    }

    // 🛠️ FIX 2: RETURN the subscription object to prevent React memory leaks
    return stompClient.subscribe(
        `/topic/workspace/${projectId}`,
        (message) => {
            callback(JSON.parse(message.body));
        }
    );
};

export const sendCodeUpdate = (message) => {
    if (!stompClient || !stompClient.connected) {
        console.error("Cannot send message: WebSocket is not connected.");
        return;
    }

    stompClient.publish({
        destination: "/app/code",
        body: JSON.stringify(message)
    });
};
export const sendPresence = (message) => {

    if (!stompClient || !stompClient.connected) {
        console.error("Cannot send presence: WebSocket is not connected.");
        return;
    }

    stompClient.publish({

        destination: "/app/presence",

        body: JSON.stringify(message)

    });

};
export const subscribePresence = (projectId, callback) => {

    if (!stompClient || !stompClient.connected) {

        console.error(
            "Cannot subscribe to presence: WebSocket is not connected."
        );

        return null;

    }

    return stompClient.subscribe(

        `/topic/presence/${projectId}`,

        (message) => {

            callback(
                JSON.parse(message.body)
            );

        }

    );

};

export const subscribeCursor = (projectId, callback) => {

    if (!stompClient || !stompClient.connected) {

        console.error(
            "Cannot subscribe to cursor: WebSocket is not connected."
        );

        return null;
    }

    return stompClient.subscribe(
        `/topic/cursor/${projectId}`,
        (message) => {

            callback(JSON.parse(message.body));

        }
    );

};
export const sendCursorPosition = (message) => {

    if (!stompClient || !stompClient.connected) {

        console.error(
            "Cannot send cursor: WebSocket is not connected."
        );

        return;
    }

    stompClient.publish({

        destination: "/app/cursor",

        body: JSON.stringify(message)

    });

};
// 🛠️ ADD THESE TWO FUNCTIONS TO websocket.js

// 1. Function to subscribe to the chat
export const subscribeChat = (projectId, callback) => {
    // Assuming your STOMP client variable inside this file is named 'stompClient'
    if (!stompClient || !stompClient.connected) {
        console.warn("Cannot subscribe to chat: WebSocket not connected.");
        return null; 
    }
    
    return stompClient.subscribe(`/topic/workspace/${projectId}/chat`, (message) => {
        callback(JSON.parse(message.body));
    });
};

// 2. Function to send a chat message
export const sendChatMessage = (projectId, chatMessage) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: `/app/workspace/${projectId}/chat`,
            body: JSON.stringify(chatMessage),
        });
    } else {
        console.error("Cannot send message: WebSocket not connected.");
    }
};


