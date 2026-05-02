import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { trackEvent } from '../firebase.js';

/**
 * System prompt constrains the assistant to Indian election topics only.
 * Reducing hallucination risk and keeping responses on-domain.
 */
const SYSTEM_PROMPT = `You are CiviGuide, a friendly and knowledgeable civic education assistant specialising in Indian elections.
You help citizens — especially first-time voters — understand the election process, voter registration, polling booths, EVMs, VVPAT, the Model Code of Conduct, and upcoming elections.
Keep answers concise, accurate, and encouraging. Use simple language. When mentioning dates, refer to the 2026 Indian Assembly Elections (Tamil Nadu: April 23, West Bengal: April 23 & 29, Results: May 4, 2026).
If asked something unrelated to elections or civic topics, politely redirect the user.`;

/**
 * Module-level Gemini client singleton.
 * - apiVersion 'v1' uses the stable endpoint where gemini-2.0-flash is GA
 *   and available to all AI Studio keys without special project access.
 * - The default 'v1beta' endpoint requires allowlist access for newer models.
 * Creating the client once avoids re-initialising the SDK on every message send.
 * Will be null if the API key is not configured.
 */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY
  ? new GoogleGenerativeAI(API_KEY, { apiVersion: 'v1' })
  : null;

const SUGGESTIONS = [
  'How do I register to vote in India?',
  'What ID do I need at the polling booth?',
  'When are Tamil Nadu election results?',
  'How does an EVM work?',
];

const INITIAL_MESSAGE = {
  role: 'model',
  content:
    "Hi! I'm **CiviGuide**, your AI assistant for all things elections. 🗳️\n\nAsk me anything — voter registration, polling booths, how EVMs work, upcoming election dates, and more!",
};

/**
 * AI-powered election assistant backed by Gemini 2.5 Flash.
 * Security notes:
 *  - Gemini client is a module-level singleton (not re-created per send).
 *  - Concurrent sends are blocked while isLoading is true.
 *  - API key absence is caught at load time and shown as a clear UI warning.
 */
export const AssistantChat = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Scroll only inside the chat box — prevents page-level scroll-jacking
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    // Guard: empty input or already waiting for a response
    if (!trimmedInput || isLoading) return;

    if (!genAI) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content:
            '⚠️ The Gemini API key is not configured. Add `VITE_GEMINI_API_KEY=your_key` to your `.env` file and restart.',
        },
      ]);
      return;
    }

    const previousMessages = [...messages];
    setMessages((prev) => [...prev, { role: 'user', content: trimmedInput }]);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: SYSTEM_PROMPT,
      });

      // Build conversation history (skip the initial greeting)
      const history = previousMessages.slice(1).map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(trimmedInput);
      const responseText = result.response.text();

      setMessages((prev) => [...prev, { role: 'model', content: responseText }]);
      trackEvent('chat_message_sent', { query_length: trimmedInput.length });
    } catch (error) {
      console.error('Chat error:', error);
      let errorMsg;
      if (error?.message?.includes('API_KEY_INVALID')) {
        errorMsg = 'The Gemini API key is invalid. Please check your `.env` file.';
      } else if (error?.message?.includes('403') || error?.message?.includes('denied access')) {
        errorMsg = '**Access denied (403).** Your API key\'s project does not have the Gemini API enabled.\n\n**Fix:** Get a new key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → "Create API key in new project", update your `.env` file, then **restart the dev server**.';

      } else if (error?.message?.includes('429')) {
        errorMsg = 'Rate limit reached. Please wait a moment and try again.';
      } else {
        errorMsg = `Something went wrong: ${error?.message || 'Unknown error'}. Please try again.`;
      }
      setMessages((prev) => [...prev, { role: 'model', content: errorMsg }]);
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
          <div
            className="mb-4 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm"
            role="alert"
          >
            <AlertTriangle size={18} className="flex-shrink-0" aria-hidden="true" />
            <span>
              <strong>API key missing.</strong> Add{' '}
              <code className="bg-amber-100 px-1 rounded">VITE_GEMINI_API_KEY=your_key</code> to your{' '}
              <code className="bg-amber-100 px-1 rounded">.env</code> file and restart the dev server.
            </span>
          </div>
        )}

        <div
          className="bg-white rounded-3xl shadow-material-2 overflow-hidden border border-slate-200 flex flex-col h-[600px]"
          role="log"
          aria-live="polite"
          aria-label="Chat conversation"
        >
          {/* Messages — scroll scoped to this container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-5"
            style={{ scrollBehavior: 'smooth' }}
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div
                    className="w-9 h-9 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm mt-1"
                    aria-hidden="true"
                  >
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm prose-slate max-w-none prose-p:my-1 prose-ul:my-1">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div
                    className="w-9 h-9 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600 shadow-sm mt-1"
                    aria-hidden="true"
                  >
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start" aria-label="CiviGuide is typing" role="status">
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

          {/* Quick-suggestion chips */}
          <div
            className="px-5 py-2.5 flex gap-2 overflow-x-auto border-t border-slate-100 bg-slate-50/80"
            style={{ scrollbarWidth: 'none' }}
            role="list"
            aria-label="Suggested questions"
          >
            {SUGGESTIONS.map((text, idx) => (
              <button
                key={idx}
                role="listitem"
                onClick={() => setInput(text)}
                aria-label={`Suggest: ${text}`}
                className="whitespace-nowrap px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
                data-testid={`suggestion-${idx}`}
              >
                {text}
              </button>
            ))}
          </div>

          {/* Input form */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSend} className="relative flex items-center" role="search" aria-label="Ask a question">
              <label htmlFor="chat-input" className="sr-only">
                Ask about voter registration, polling booths, election dates
              </label>
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about voter registration, polling booths, election dates..."
                className="w-full pl-5 pr-14 py-3.5 bg-slate-100 rounded-full text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all"
                disabled={isLoading}
                aria-disabled={isLoading}
                data-testid="chat-input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md focus-visible:ring-2 focus-visible:ring-blue-500"
                data-testid="chat-send-btn"
              >
                <Send size={16} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
