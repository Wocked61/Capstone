import { useState } from "react";
import "./Gemini.css";

export default function Gemini() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi. Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const endpoint = import.meta.env.VITE_GEMINI_ENDPOINT;

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setError("");
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      if (!endpoint) throw new Error("Missing VITE_GEMINI_ENDPOINT configuration.");

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const errorDetail = await res.text();
        throw new Error(`Backend error (${res.status}): ${errorDetail}`);
      }

      const data = await res.json();
      const reply = data?.reply || "No reply returned.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      const errorMsg = err.message || "Something went wrong.";
      setError(errorMsg);
      // Show error in chat as assistant message
      setMessages((prev) => [...prev, { role: "assistant", text: `⚠️ Error: ${errorMsg}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gemini-page">
      <div className="gemini-card">
        <h2>Gemini Chat</h2>
        <p className="gemini-sub">Connected to backend API</p>

        <div className="gemini-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <span>{m.text}</span>
            </div>
          ))}
          {loading && <div className="msg assistant"><span>Thinking...</span></div>}
        </div>

        {error && <p className="gemini-error">{error}</p>}

        <form onSubmit={handleSend} className="gemini-form">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}