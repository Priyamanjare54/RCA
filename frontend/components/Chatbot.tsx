
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { chatWithGemini } from '../services/gemini';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to Rajendra Cricket Academy AI Coach. I'm here to help with technique, mental drills, or RCA info. What's on your mind today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await chatWithGemini(input, history);
      
      const modelMsg: Message = { 
        role: 'model', 
        text: response || "Apologies, athlete. I hit a snag. Try asking your question again.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Network interference in the lab. Please check your connection and retry.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
      <div className="absolute inset-0 bg-slate-50 opacity-50 pointer-events-none"></div>
      
      {/* Header */}
      <div className="p-6 bg-[#252968] text-white flex items-center justify-between z-10 border-b-4 border-[#f2ad3f]">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f2ad3f] flex items-center justify-center text-2xl shadow-lg border-2 border-white/20 transform rotate-3">
            🏏
          </div>
          <div>
            <h3 className="font-black heading-font uppercase tracking-wider text-xl">Coach Rajendra <span className="text-[#f2ad3f]">AI</span></h3>
            <p className="text-[9px] text-blue-200 uppercase tracking-[0.3em] font-black">Elite Performance Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#f2ad3f]">Neural Link Online</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 z-10"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}
          >
            <div className={`max-w-[85%] rounded-3xl p-6 shadow-md relative group ${
              msg.role === 'user' 
                ? 'bg-[#252968] text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none border-l-4 border-l-[#f2ad3f]'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
              <div className={`absolute -bottom-6 flex items-center space-x-1 opacity-40 ${msg.role === 'user' ? 'right-0' : 'left-0'}`}>
                <span className="text-[9px] font-black uppercase tracking-tighter">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.role === 'model' && <span className="text-[9px] font-black uppercase text-[#252968]"> - RCA AI</span>}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-slate-100 p-5 rounded-3xl rounded-tl-none shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#252968] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#f2ad3f] rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-[#252968] rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t-2 border-slate-50 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center space-x-4 bg-slate-100 rounded-2xl px-6 py-3 border-2 border-slate-200 focus-within:border-[#252968] focus-within:bg-white transition-all shadow-inner">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask RCA Coach about drills, strategy or mindset..."
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 font-bold py-2 placeholder:text-slate-400"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="text-[#252968] hover:text-[#1a1d4a] disabled:opacity-20 transition-all transform hover:scale-110 active:scale-90"
          >
            <svg className="w-8 h-8 rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
