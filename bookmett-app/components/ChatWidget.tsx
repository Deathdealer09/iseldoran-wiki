"use client";

import { useEffect, useRef, useState } from "react";

const QUICKS = ["Book a haircut tomorrow", "What times are free?", "Do you do facials?", "Cancel my booking"];

interface Msg { who: "bot" | "me"; html: string; }

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [state, setState] = useState<any>({ stage: "idle" });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [rec, setRec] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ who: "bot", html: "Hi! 👋 I'm the BookMeTT AI assistant. Tell me what you need and I'll book it in seconds — or tap the 🎤 mic to book by voice." }]);
    }
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, busy]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    setInput("");
    setMsgs((m) => [...m, { who: "me", html: escapeHtml(t) }]);
    setBusy(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: t, state }),
      });
      const data = await res.json();
      setState(data.state || { stage: "idle" });
      setMsgs((m) => [...m, { who: "bot", html: data.reply || "Sorry, I didn't catch that." }]);
    } catch {
      setMsgs((m) => [...m, { who: "bot", html: "I'm having trouble connecting right now — please try again." }]);
    } finally {
      setBusy(false);
    }
  }

  function voiceDemo() {
    if (busy) return;
    setRec(true);
    setMsgs((m) => [...m, { who: "me", html: "🎤 <i>Listening…</i>" }]);
    setTimeout(() => {
      setRec(false);
      setMsgs((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { who: "me", html: "🎤 “Book me a haircut tomorrow at 2pm”" };
        return copy;
      });
      send("book a haircut tomorrow at 2pm");
    }, 1500);
  }

  if (!open) {
    return (
      <button className="fab" onClick={() => setOpen(true)}>
        <span className="pulse" /> Book with AI
      </button>
    );
  }

  return (
    <div className="chat">
      <div className="chat-h">
        <div className="av">🤖</div>
        <div>
          <div className="who">BookMeTT Assistant</div>
          <div className="st">Online · replies instantly</div>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
      </div>

      <div className="chat-body" ref={bodyRef}>
        {msgs.map((m, i) => (
          <div key={i} className={"msg " + m.who} dangerouslySetInnerHTML={{ __html: m.html }} />
        ))}
        {busy && (
          <div className="msg bot">
            <span className="typing"><span /><span /><span /></span>
          </div>
        )}
      </div>

      <div className="quicks">
        {QUICKS.map((q) => (
          <button key={q} className="quick" onClick={() => send(q)}>{q}</button>
        ))}
      </div>

      <div className="chat-in">
        <button className={"mic" + (rec ? " rec" : "")} onClick={voiceDemo} aria-label="Voice booking" title="Voice booking">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" /></svg>
        </button>
        <input
          value={input}
          placeholder="Type a message…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
        />
        <button className="send" onClick={() => send(input)} aria-label="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
        </button>
      </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
