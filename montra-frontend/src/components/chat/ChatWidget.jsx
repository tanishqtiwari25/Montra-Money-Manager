import React, { useState } from 'react';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! Mai aapka financial assistant hoon. Main aapki kya madad kar sakta hoon?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: 'Is feature ki live processing backend API ke saath sync hai.', sender: 'bot' }
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-3 bg-brand-600 text-white flex justify-between items-center font-medium text-sm">
            <span>Finance AI Assistant</span>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-80">✕</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2.5 rounded-xl max-w-[80%] ${m.sender === 'user' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="p-2 border-t border-slate-100 dark:border-slate-800 flex gap-1">
            <input
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none dark:text-slate-100"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="px-3 py-1.5 bg-brand-600 text-white text-xs rounded-lg font-medium">
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3.5 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-700 transition-all"
        >
          💬
        </button>
      )}
    </div>
  );
};