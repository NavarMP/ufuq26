'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  text: string;
}

export default function AIAssistant() {
  const { eventInfo, schedule, guests, faqs } = useEvent();
  const { t, isRtl, language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Assalamu Alaikum! I am the UFUQ ’26 Assistant. I can answer questions regarding camp dates, eligibility, schedule, venue, and registration based strictly on published event records. How can I assist you?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          context: {
            title: eventInfo.titleEnglish,
            dates: `${eventInfo.startDate} to ${eventInfo.endDate}`,
            venue: eventInfo.venue,
            scheduleSessionsCount: schedule.length,
            faqCount: faqs.length,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data.reply || t('assistant.noAnswer') },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: t('assistant.error') },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "I am having difficulty connecting right now. Please explore the FAQ or contact the ADSA organizers directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'Who is eligible to attend?',
    'What are the camp dates and venue?',
    'What is the registration process?',
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 p-3.5 rounded-full bg-brand-navy dark:bg-brand-gold text-brand-gold dark:text-brand-navy shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-brand-gold/40 flex items-center gap-2 group"
        aria-label="Open AI Event Assistant"
        title="Ask UFUQ Assistant"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="hidden sm:inline font-clash font-bold text-xs">
          Ask UFUQ AI
        </span>
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="UFUQ AI Event Assistant"
          className="fixed bottom-20 md:bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[390px] h-[500px] max-h-[75vh] rounded-3xl glass-panel shadow-2xl border border-brand-gold/30 flex flex-col overflow-hidden animate-scale-in"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-brand-gold/20 bg-brand-navy text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-clash text-sm font-bold leading-tight">UFUQ Assistant</h3>
                <span className="text-[10px] text-brand-gold font-mono">Strict Event Knowledge</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-brand-gold text-brand-navy font-medium rounded-tr-none'
                      : 'glass-panel border border-brand-gold/15 text-neutral-800 dark:text-neutral-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-neutral-400 text-xs">
                <Bot className="w-4 h-4 text-brand-gold animate-bounce" />
                <span>Checking confirmed event records...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sample Questions Chips */}
          {messages.length <= 2 && (
            <div className="px-3 py-1.5 border-t border-brand-gold/10 flex flex-wrap gap-1.5 bg-black/5 dark:bg-white/5">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="px-2.5 py-1 rounded-full text-[10px] bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/20 text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-brand-gold/20 bg-white/50 dark:bg-black/40 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about UFUQ '26..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none border border-transparent focus:border-brand-gold/40"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy disabled:opacity-40 transition-colors"
              aria-label="Send query"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
