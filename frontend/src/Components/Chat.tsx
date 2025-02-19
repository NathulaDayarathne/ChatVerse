import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

interface Message {
    user: string;
    message: string;
}

const Chat: React.FC = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [user, setUser] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // Create SignalR connection
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5001/ChatHub") // Update this URL if needed
            .withAutomaticReconnect()
            .build();

        newConnection.start()
            .then(() => console.log("Connected to SignalR Hub"))
            .catch(err => console.error("Connection error:", err));

        // Handle incoming messages
        newConnection.on("ReceiveMessage", (user: string, message: string) => {
            setMessages(prevMessages => [...prevMessages, { user, message }]);
        });

        setConnection(newConnection);

        return () => {
            newConnection.stop();
        };
    }, []);

    const sendMessage = async () => {
        if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
            console.error("SignalR is not connected yet.");
            return;
        }
        try {
            await connection.invoke("SendMessage", user, message);
            setMessage(""); // Clear input
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };
    

    return (
        <div className="container">
            <div className="row p-1">
                <div className="col-1">User</div>
                <div className="col-5">
                    <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />
                </div>
            </div>
            <div className="row p-1">
                <div className="col-1">Message</div>
                <div className="col-5">
                    <input
                        type="text"
                        className="w-100"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
            </div>
            <div className="row p-1">
                <div className="col-6 text-end">
                    <button onClick={sendMessage} disabled={!connection}>Send Message</button>
                </div>
            </div>
            <div className="row p-1">
                <div className="col-6"><hr /></div>
            </div>
            <div className="row p-1">
                <div className="col-6">
                    <ul>
                        {messages.map((msg, index) => (
                            <li key={index}>{msg.user} says {msg.message}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Chat;
