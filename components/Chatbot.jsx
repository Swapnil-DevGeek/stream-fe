"use client";
import { useState } from "react";

export default function Chatbot() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse(""); // Clear the previous response
        setIsTyping(true); // Show typing indicator

        const responseStream = await fetch("http://127.0.0.1:8000/stream");
        const reader = responseStream.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            await typeLetterByLetter(decoder.decode(value));
        }

        setIsTyping(false); // Hide typing indicator
    };

    const typeLetterByLetter = async (text) => {
        for (let char of text) {
            setResponse((prev) => prev + char);
            await new Promise((resolve) => setTimeout(resolve, 50)); // Typing speed (adjust as needed)
        }
    };

    return (
        <div className="chat-container">
            <h1>Chatbot</h1>
            <form className="chat-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type something..."
                />
                <button className="send-button" type="submit">
                    Send
                </button>
            </form>
            <div className="chat-response">
                <h3>Response:</h3>
                <pre className="response-box">{response}</pre>
                {isTyping && <p className="typing-indicator">Typing...</p>}
            </div>
        </div>
    );
}
