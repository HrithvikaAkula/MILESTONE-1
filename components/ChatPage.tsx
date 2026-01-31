import React, { useState, useEffect, useRef } from 'react';
import { ResearchDocument } from '../types';

interface ChatPageProps {
  documents: ResearchDocument[];
  selectedDocId: string | null;
  onSelectDoc: (id: string) => void;
  onBackToWorkspace?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'hinglish', label: 'Hinglish' },
];

const ChatPage: React.FC<ChatPageProps> = ({ documents, selectedDocId, onSelectDoc }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [isListening, setIsListening] = useState(false);
  const [docDropdownOpen, setDocDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedDoc = documents.find(d => d.id === selectedDocId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'init',
        role: 'assistant',
        text: "Namaste! I am your AI Research Assistant. Select a document above and ask me anything in English, Hindi, or Marathi.",
        timestamp: new Date(),
      }]);
    }
  }, []);

  const handleSpeak = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Try Chrome.");
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang === 'hinglish' ? 'hi-IN' : selectedLang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const langCode = selectedLang === 'hinglish' ? 'hi-IN' : selectedLang;
    const voice = voices.find(v => v.lang.includes(langCode.split('-')[0]));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!selectedDoc) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: "Please select a document from the dropdown above to start chatting.",
        timestamp: new Date(),
      }]);
      return;
    }
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const prompt = `
        You are an intelligent research assistant.
        User Language Preference: ${selectedLang}
        Context Document:
        Title: ${selectedDoc.name}
        Content Snippet (first 20000 chars): 
        ${selectedDoc.content.substring(0, 20000)}...
        User Question: ${userMsg.text}
        Instructions:
        1. Answer based ONLY on the provided context if possible.
        2. If the user asks in Hindi/Marathi, reply in that language.
        3. If 'Hinglish' is selected, reply in a mix of Hindi and English.
        4. Be concise and accurate.
      `;
      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || `Server Error: ${response.status}`);
      }
      const data = await response.json();
      const text = data.response || "No response generated.";
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text,
        timestamp: new Date(),
      }]);
      speakText(text);
    } catch (error: any) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `Sorry, I encountered an error: ${error.message || "Unknown error"}. Please check your connection and API key.`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-56px)]">
      {/* Header with doc dropdown + language – no sidebar */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex flex-wrap items-center gap-3 shrink-0">
        <div className="relative flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Document</label>
          <button
            type="button"
            onClick={() => setDocDropdownOpen(!docDropdownOpen)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-left text-white hover:border-slate-600 transition-colors text-sm"
          >
            <span className="truncate">
              {selectedDoc ? selectedDoc.name : documents.length === 0 ? 'No papers' : 'Select a paper…'}
            </span>
            <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform ${docDropdownOpen ? 'rotate-180' : ''}`}></i>
          </button>
          {docDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDocDropdownOpen(false)} aria-hidden="true" />
              <div className="absolute z-20 mt-1 w-full max-w-sm bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {documents.length === 0 ? (
                  <div className="px-4 py-3 text-slate-500 text-sm">No papers uploaded.</div>
                ) : (
                  documents.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => { onSelectDoc(doc.id); setDocDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 flex flex-col gap-0.5 border-b border-slate-800 last:border-0 hover:bg-slate-800 transition-colors ${
                        selectedDocId === doc.id ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300'
                      }`}
                    >
                      <span className="font-medium truncate">{doc.name}</span>
                      <span className="text-xs text-slate-500">{(doc.content.length / 1000).toFixed(1)}k chars</span>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
        <div className="w-32">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Language</label>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="w-full text-sm bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 focus:border-cyan-500 focus:outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages – full width, no sidebar */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-xl p-4 text-sm ${
                msg.role === 'user'
                  ? 'bg-cyan-500 text-slate-900 rounded-br-md'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 rounded-bl-md'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
              <div className={`text-[10px] mt-2 opacity-70 ${msg.role === 'user' ? 'text-slate-700' : 'text-slate-500'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl rounded-bl-md flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input – full width */}
      <div className="bg-slate-900 border-t border-slate-800 p-4 shrink-0">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <button
            onClick={handleSpeak}
            className={`p-2.5 rounded-lg transition-colors shrink-0 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? 'Listening…' : 'Ask about the paper…'}
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg px-4 py-2.5 focus:border-cyan-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-cyan-500 text-slate-900 p-2.5 rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
