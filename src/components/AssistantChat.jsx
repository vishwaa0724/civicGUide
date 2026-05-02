import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { trackEvent } from '../firebase.js';

const SYSTEM_PROMPT = `You are CiviGuide, a friendly and knowledgeable civic education assistant specialising in Indian elections.
You help citizens — especially first-time voters — understand the election process, voter registration, polling booths, EVMs, VVPAT, the Model Code of Conduct, and upcoming elections.
Keep answers concise, accurate, and encouraging. Use simple language. When mentioning dates, refer to the 2026 Indian Assembly Elections (Tamil Nadu: April 23, West Bengal: April 23 & 29, Results: May 4, 2026).
If asked something unrelated to elections or civic topics, politely redirect the user.`;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Calls Gemini REST API directly via fetch — no SDK dependency.
 * Tries gemini-2.5-flash → gemini-2.0-flash → gemini-2.0-flash-lite in order.
 */
const callAI = async (messages) => {
  const models = ['gemini-2.5-flash', 'gemini-2.5-pro'];

  for (const model of models) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
          generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
        }),
      }
    );

    if (res.status === 404) continue; // model not on this key — try next

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`${res.status}: ${err?.error?.message || res.statusText}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response');
    return text;
  }
  throw new Error('No Gemini model responded successfully.');
};

const SUGGESTIONS = [
  'How do I register to vote in India?',
  'What ID do I need at the polling booth?',
  'When are Tamil Nadu election results?',
  'How does an EVM work?',
];

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm **CiviGuide**, your AI assistant for all things elections. 🗳️\n\nAsk me anything — voter registration, polling booths, how EVMs work, upcoming election dates, and more!",
};

export const AssistantChat = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    if (!API_KEY) {
      setMessages((prev) => [...prev, { role: 'assistant', content: '⚠️ API key not configured. Add `VITE_OPENAI_API_KEY=sk-...` to `.env` and restart.' }]);
      return;
    }

    const previousMessages = [...messages];
    setMessages((prev) => [...prev, { role: 'user', content: trimmedInput }]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [
        ...previousMessages.slice(1).map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: trimmedInput },
      ];

      const responseText = await callAI(history);
      setMessages((prev) => [...prev, { role: 'assistant', content: responseText }]);
      trackEvent('chat_message_sent', { query_length: trimmedInput.length });
    } catch (error) {
      const msg = error?.message || '';
      let errorMsg;
      if (msg.includes('401')) {
        errorMsg = '❌ Invalid API key. Check your `.env` file — the key should start with `sk-`.';
      } else if (msg.includes('429')) {
        errorMsg = '⏳ Rate limit reached. Please wait a moment and try again.';
      } else if (msg.includes('Failed to fetch')) {
        errorMsg = '🌐 Network error — check your internet connection and try again.';
      } else {
        errorMsg = `❌ Something went wrong: ${msg}. Please try again.`;
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-blue-50/30" id="assistant" aria-labelledby="assistant-heading">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={16} aria-hidden="true" /> Powered by Gemini AI
          </div>
          <h2 id="assistant-heading" className="text-4xl font-bold text-slate-900 tracking-tight">
            AI Election Assistant
          </h2>
          <p className="mt-3 text-slate-600">Get instant, accurate answers to all your civic and election questions.</p>
        </div>

        {!API_KEY && (
          <div className="mb-4 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm" role="alert">
            <AlertTriangle size={18} className="flex-shrink-0" aria-hidden="true" />
            <span><strong>API key missing.</strong> Add <code className="bg-amber-100 px-1 rounded">VITE_GEMINI_API_KEY=AIza...</code> to your <code className="bg-amber-100 px-1 rounded">.env</code> and restart.</span>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-material-2 overflow-hidden border border-slate-200 flex flex-col h-[600px]" role="log" aria-live="polite" aria-label="Chat conversation">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-5" style={{ scrollBehavior: 'smooth' }} aria-live="polite" aria-atomic="false">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm mt-1" aria-hidden="true">
                    <Bot size={18} />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm prose-slate max-w-none prose-p:my-1 prose-ul:my-1">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600 shadow-sm mt-1" aria-hidden="true">
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start" role="status" aria-label="Assistant is typing">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm" aria-hidden="true">
                  <Loader2 size={18} className="animate-spin" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${delay}s` }} aria-hidden="true" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-5 py-2.5 flex gap-2 overflow-x-auto border-t border-slate-100 bg-slate-50/80" style={{ scrollbarWidth: 'none' }} role="list" aria-label="Suggested questions">
            {SUGGESTIONS.map((text, idx) => (
              <button key={idx} role="listitem" onClick={() => setInput(text)} aria-label={`Suggest: ${text}`}
                className="whitespace-nowrap px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                data-testid={`suggestion-${idx}`}>
                {text}
              </button>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSend} className="relative flex items-center" role="search" aria-label="Ask a question">
              <label htmlFor="chat-input" className="sr-only">Ask about voter registration, polling booths, election dates</label>
              <input
                id="chat-input" type="text" value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about voter registration, polling booths, election dates..."
                className="w-full pl-5 pr-14 py-3.5 bg-slate-100 rounded-full text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all"
                disabled={isLoading} aria-disabled={isLoading} data-testid="chat-input"
              />
              <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send message"
                className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md focus-visible:ring-2 focus-visible:ring-blue-500"
                data-testid="chat-send-btn">
                <Send size={16} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
