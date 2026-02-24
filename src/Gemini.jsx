import { useState } from "react";
import "./Gemini.css";

export default function Gemini() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi. This is Gemini test mode. Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const endpoint = import.meta.env.VITE_GEMINI_ENDPOINT; // e.g. http://localhost:4000/api/gemini/chat
  const testMode = import.meta.env.VITE_GEMINI_TEST_MODE === "true";

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setError("");
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      // Local mock mode for UI testing
      if (testMode || !endpoint) {
        await new Promise((r) => setTimeout(r, 400));
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: `Test reply: I received "${text}".` },
        ]);
        return;
      }

      // Real backend call (Gemini key must stay on server)
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const data = await res.json();
      const reply = data?.reply || "No reply returned.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gemini-page">
      <div className="gemini-card">
        <h2>Gemini Chat Test</h2>
        <p className="gemini-sub">
          Mode: <strong>{testMode || !endpoint ? "Mock (UI test)" : "Backend API"}</strong>
        </p>

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