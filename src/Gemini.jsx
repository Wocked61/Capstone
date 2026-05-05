import { useState } from "react";
import "./Gemini.css";

export default function Gemini({ onApplySchedule }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I can help you plan your week. Try asking me to create a schedule for you (e.g., 'Plan my week with study, exercise, and relaxation')." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const endpoint = import.meta.env.VITE_GEMINI_ENDPOINT;

  // Parser function to extract tasks from Gemini's natural language response
  const parseScheduleFromResponse = (text) => {
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const tasks = [];

    // Split by lines and process
    const lines = text.split('\n');
    let currentDay = null;

    lines.forEach((line) => {
      line = line.trim();
      if (!line) return;

      // Check if line is a day header (e.g., "**Monday**" or "Monday")
      const dayMatch = line.match(/\*?\*?(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\*?\*?/i);
      if (dayMatch) {
        const dayName = dayMatch[1];
        currentDay = DAYS_SHORT[DAYS.findIndex(d => d.toLowerCase() === dayName.toLowerCase())];
        return;
      }

      if (!currentDay) return;

      // Remove markdown formatting (bold, brackets, etc.)
      let cleanLine = line
        .replace(/\*\*/g, '')        // Remove bold **
        .replace(/\*\*\[/g, '')      // Remove **[
        .replace(/\]\*\*/g, '')      // Remove ]**
        .replace(/\[/g, '')          // Remove [
        .replace(/\]/g, '');         // Remove ]

      // Skip lines that don't contain time information
      if (!cleanLine.match(/\d{1,2}:\d{2}/)) return;

      // Extract time (get start time from range if present)
      const timeMatch = cleanLine.match(/(\d{1,2}):(\d{2})/);
      if (!timeMatch) return;

      let hour = parseInt(timeMatch[1]);
      let minute = parseInt(timeMatch[2]);

      // Extract task description
      // Remove time ranges and get the description after the colon or dash
      let task = cleanLine
        .replace(/\d{1,2}:\d{2}\s*[-–—]\s*\d{1,2}:\d{2}/, '') // Remove time ranges
        .replace(/\d{1,2}:\d{2}/, '')                          // Remove single time
        .replace(/^[-–—:\s]+/, '')                             // Remove leading dashes/colons/spaces
        .replace(/^Fixed Appointment\s+/i, '')                // Remove "Fixed Appointment" marker
        .trim();

      // Skip if no task description or if it's just metadata
      if (!task || task.length < 2 || task.toLowerCase().includes('key:') || 
          task.toLowerCase().includes('flexible:') || task.toLowerCase().includes('optional:')) {
        return;
      }

      // Limit task description length for cleaner display
      task = task.substring(0, 60).replace(/[/•].+$/, '').trim();

      if (task) {
        const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        tasks.push({
          title: task,
          day: currentDay,
          time: timeStr,
        });
      }
    });

    return tasks;
  };

  const handleApplySchedule = () => {
    if (!messages.length) return;

    // Get the last assistant message
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistantMsg) {
      alert('No schedule suggestion found. Ask me to plan your week first!');
      return;
    }

    const parsedTasks = parseScheduleFromResponse(lastAssistantMsg.text);

    if (parsedTasks.length === 0) {
      alert('Could not parse any tasks from the suggestion. Make sure the response includes days, times, and tasks.');
      return;
    }

    if (onApplySchedule) {
      onApplySchedule(parsedTasks);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `✅ Applied ${parsedTasks.length} task(s) to your weekly plan!`
      }]);
    }
  };

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
      setMessages((prev) => [...prev, { role: "assistant", text: `⚠️ Error: ${errorMsg}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gemini-page">
      <div className="gemini-card">
        <h2>Gemini Chat</h2>
        <p className="gemini-sub">Ask me to plan your week or optimize your schedule</p>

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

        <button
          onClick={handleApplySchedule}
          className="gemini-apply-btn"
          disabled={loading}
          style={{
            marginTop: '8px',
            padding: '8px 12px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            width: '100%',
          }}
        >
          Apply Schedule to Plan
        </button>
      </div>
    </div>
  );
}