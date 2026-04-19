import { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = `You are Satish's portfolio assistant — a smart, friendly AI that helps visitors learn about Satish Pakalapati.

About Satish:
- B.Tech Computer Science student at Lovely Professional University (CGPA: 8.1/10)
- Data Scientist & Full Stack Developer
- Skills: Python, Machine Learning, Data Science, SQL, JavaScript, React, Digital Marketing
- Projects: 6+ projects including dashboards, ML models, and web apps
- Certifications: NPTEL Cloud Computing, Coursera Supervised ML (Stanford), HackerRank Python, Generative AI for Developers (NPTEL), C++ for C Programmers (Coursera/UC Santa Cruz)
- GitHub: github.com/Satish-970
- LinkedIn: linkedin.com/in/satishpakalapati
- Email: satishpakalapati65@gmail.com
- Blog: satishportfolio.blogspot.com
- Open to remote opportunities

Keep responses concise (2-4 sentences max), warm, and helpful. If asked about things you don't know, be honest. Always encourage visitors to explore the portfolio or reach out directly to Satish.`;

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Satish's AI assistant 👋 Ask me anything about his skills, projects, or how to get in touch!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
      
      if (!apiKey) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I'm temporarily offline. Please reach out to Satish directly at satishpakalapati65@gmail.com or visit his GitHub at github.com/Satish-970" 
        }]);
        setLoading(false);
        return;
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-opus-4-1',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: newMessages.filter(m => m.role !== 'system').map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data?.content?.[0]?.text || "Sorry, I couldn't get a response. Try again!";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please email Satish at satishpakalapati65@gmail.com instead!" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sendQuickQuestion = async (question) => {
    if (loading) return;
    const userMsg = { role: 'user', content: question };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);
    
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
      
      if (!apiKey) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I'm temporarily offline. Please reach out to Satish at satishpakalapati65@gmail.com" 
        }]);
        setLoading(false);
        return;
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-opus-4-1',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data?.content?.[0]?.text || "Sorry, couldn't get a response!";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Quick question error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection issue. Email Satish at satishpakalapati65@gmail.com" }]);
    } finally {
      setLoading(false);
    }
  };
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const quickQuestions = [
    "What are Satish's top skills?",
    "What projects has he built?",
    "How can I hire Satish?",
  ];

  return (
    <>
      {/* Floating trigger button */}
      <button
        className="chatbot__trigger"
        onClick={() => setOpen(v => !v)}
        aria-label="Open chat"
        title="Chat with Satish's AI assistant"
        style={{ zIndex: 9985 }}
      >
        {open
          ? <i className="ri-close-line"></i>
          : <i className="ri-robot-2-line"></i>
        }
        {!open && <span className="chatbot__ping"></span>}
      </button>

      {/* Chat window */}
      {open && (
        <div className="chatbot__window">
          {/* Header */}
          <div className="chatbot__header">
            <div className="chatbot__header-avatar">
              <i className="ri-robot-2-line"></i>
            </div>
            <div>
              <div className="chatbot__header-name">Satish's Assistant</div>
              <div className="chatbot__header-status">
                <span className="chatbot__status-dot"></span> Online
              </div>
            </div>
            <button className="chatbot__close" onClick={() => setOpen(false)}>
              <i className="ri-close-line"></i>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot__messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot__msg chatbot__msg--${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="chatbot__msg-avatar"><i className="ri-robot-2-line"></i></div>
                )}
                <div className="chatbot__msg-bubble">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chatbot__msg chatbot__msg--assistant">
                <div className="chatbot__msg-avatar"><i className="ri-robot-2-line"></i></div>
                <div className="chatbot__msg-bubble chatbot__typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions — only show if just the greeting */}
          {messages.length === 1 && (
            <div className="chatbot__quick">
              {quickQuestions.map((q, i) => (
                <button key={i} className="chatbot__quick-btn" onClick={() => sendQuickQuestion(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot__input-row">
            <input
              ref={inputRef}
              className="chatbot__input"
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="chatbot__send"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* CHATBOT */
        .chatbot__trigger{
          position:fixed;bottom:6.5rem;right:2rem;
          width:56px;height:56px;border-radius:50%;
          background:var(--gradient);color:var(--bg);
          border:none;cursor:pointer;font-size:1.4rem;
          display:flex;align-items:center;justify-content:center;
          z-index:9980;
          box-shadow:0 4px 24px rgba(232,184,75,.55),0 2px 8px rgba(0,0,0,.5);
          transition:transform .3s var(--ease-back),box-shadow .3s ease;
        }
        .chatbot__trigger:hover{transform:scale(1.1) translateY(-3px);box-shadow:0 8px 36px rgba(232,184,75,.7)}
        .chatbot__ping{
          position:absolute;top:-3px;right:-3px;width:14px;height:14px;
          background:#4ade80;border-radius:50%;border:2px solid var(--bg);
          animation:chatPing 2s ease-in-out infinite;
        }
        @keyframes chatPing{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:.7}}

        .chatbot__window{
          position:fixed;bottom:12rem;right:2rem;
          width:360px;max-height:500px;
          background:var(--bg-2);border:1px solid var(--border-bright);
          border-radius:20px;z-index:9970;
          display:flex;flex-direction:column;
          box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 0 1px rgba(232,184,75,.1);
          overflow:hidden;
          animation:chatSlideUp .25s var(--ease-expo);
        }
        @keyframes chatSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

        .chatbot__header{
          display:flex;align-items:center;gap:.75rem;
          padding:1rem 1.25rem;
          background:linear-gradient(135deg,rgba(232,184,75,.12),rgba(255,149,0,.06));
          border-bottom:1px solid var(--border);flex-shrink:0;
        }
        .chatbot__header-avatar{
          width:36px;height:36px;border-radius:50%;
          background:var(--gradient);display:flex;align-items:center;
          justify-content:center;color:var(--bg);font-size:1.1rem;flex-shrink:0;
        }
        .chatbot__header-name{font-family:var(--font-display);font-size:.95rem;font-weight:700;color:var(--text)}
        .chatbot__header-status{display:flex;align-items:center;gap:5px;font-size:.72rem;color:var(--text-muted)}
        .chatbot__status-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block;animation:chatPing 2s ease-in-out infinite}
        .chatbot__close{margin-left:auto;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.1rem;padding:.25rem;line-height:1;transition:color .2s}
        .chatbot__close:hover{color:var(--gold)}

        .chatbot__messages{
          flex:1;overflow-y:auto;padding:1rem;
          display:flex;flex-direction:column;gap:.75rem;
          scroll-behavior:smooth;
        }
        .chatbot__messages::-webkit-scrollbar{width:4px}
        .chatbot__messages::-webkit-scrollbar-track{background:transparent}
        .chatbot__messages::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

        .chatbot__msg{display:flex;align-items:flex-end;gap:.5rem}
        .chatbot__msg--user{flex-direction:row-reverse}
        .chatbot__msg-avatar{
          width:28px;height:28px;border-radius:50%;
          background:var(--gradient);display:flex;align-items:center;
          justify-content:center;color:var(--bg);font-size:.8rem;flex-shrink:0;
        }
        .chatbot__msg-bubble{
          max-width:78%;padding:.65rem .9rem;border-radius:14px;
          font-size:.85rem;line-height:1.6;
        }
        .chatbot__msg--assistant .chatbot__msg-bubble{
          background:var(--surface);border:1px solid var(--border);
          color:var(--text);border-bottom-left-radius:4px;
        }
        .chatbot__msg--user .chatbot__msg-bubble{
          background:var(--gradient);color:var(--bg);
          border-bottom-right-radius:4px;font-weight:500;
        }

        .chatbot__typing{display:flex;align-items:center;gap:4px;padding:.75rem 1rem !important}
        .chatbot__typing span{
          width:7px;height:7px;border-radius:50%;
          background:var(--gold);display:inline-block;
          animation:typingDot 1.2s ease-in-out infinite;
        }
        .chatbot__typing span:nth-child(2){animation-delay:.2s}
        .chatbot__typing span:nth-child(3){animation-delay:.4s}
        @keyframes typingDot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}

        .chatbot__quick{
          display:flex;flex-wrap:wrap;gap:.5rem;
          padding:.75rem 1rem;border-top:1px solid var(--border);flex-shrink:0;
        }
        .chatbot__quick-btn{
          font-size:.75rem;padding:.35rem .75rem;
          background:rgba(232,184,75,.08);border:1px solid var(--border);
          border-radius:100px;color:var(--text-muted);cursor:pointer;
          transition:all .2s ease;font-family:var(--font-body);
          white-space:nowrap;
        }
        .chatbot__quick-btn:hover{background:rgba(232,184,75,.15);color:var(--gold);border-color:var(--border-bright)}

        .chatbot__input-row{
          display:flex;gap:.5rem;padding:.75rem 1rem;
          border-top:1px solid var(--border);flex-shrink:0;
          background:var(--bg-2);
        }
        .chatbot__input{
          flex:1;padding:.6rem .9rem;background:var(--surface);
          border:1px solid var(--border);border-radius:100px;
          color:var(--text);font-family:var(--font-body);font-size:.875rem;
          outline:none;transition:border-color .2s;
        }
        .chatbot__input:focus{border-color:var(--border-bright)}
        .chatbot__input::placeholder{color:var(--text-dim)}
        .chatbot__send{
          width:38px;height:38px;border-radius:50%;
          background:var(--gradient);border:none;cursor:pointer;
          color:var(--bg);font-size:1rem;
          display:flex;align-items:center;justify-content:center;
          transition:transform .2s var(--ease-back),opacity .2s;flex-shrink:0;
        }
        .chatbot__send:hover:not(:disabled){transform:scale(1.1)}
        .chatbot__send:disabled{opacity:.4;cursor:not-allowed}

        @media(max-width:480px){
          .chatbot__window{width:calc(100vw - 2rem);right:1rem;bottom:14rem;max-height:380px}
          .chatbot__trigger{right:1rem;bottom:6.5rem}
        }
      `}</style>
    </>
  );
};

export default Chatbot;
