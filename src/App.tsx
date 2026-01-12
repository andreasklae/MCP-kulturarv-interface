import { useState, useRef, useEffect } from 'react';
import { Message, Source, SOURCE_INFO } from './types';
import { sendMessage, ApiError } from './api';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('kulturarv_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>(['wikipedia', 'snl', 'riksantikvaren']);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on auth
  useEffect(() => {
    if (isAuthenticated) {
      inputRef.current?.focus();
    }
  }, [isAuthenticated]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      localStorage.setItem('kulturarv_token', token);
      setIsAuthenticated(true);
      setError(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kulturarv_token');
    setToken('');
    setIsAuthenticated(false);
    setMessages([]);
  };

  const toggleSource = (source: Source) => {
    setSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || sources.length === 0) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Build conversation history for context
      const history = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await sendMessage(token, {
        message: userMessage.content,
        sources,
        conversation_history: history,
      });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        toolsUsed: response.tools_used,
        sourcesConsulted: response.sources_consulted,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setIsAuthenticated(false);
          setError('Invalid token. Please re-authenticate.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  // Auth screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-fjord-700/50 border border-fjord-600/50 mb-4">
              <span className="text-3xl text-rune">ᚲ</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">Kulturarv Chat</h1>
            <p className="text-stone-400">Utforsk norsk kulturarv med AI</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-stone-300 mb-2">
                Access Token
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your access token"
                className="input-field"
                autoFocus
              />
              <p className="mt-2 text-xs text-stone-500">
                Contact the administrator to get an access token
              </p>
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
            
            <button type="submit" className="btn-primary w-full">
              Start Exploring
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-stone-800">
            <p className="text-xs text-stone-500 text-center">
              Powered by Riksantikvaren, Wikipedia & Store norske leksikon
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Chat screen
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-stone-900/80 backdrop-blur-lg border-b border-stone-800/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-fjord-700/50 border border-fjord-600/50 flex items-center justify-center">
              <span className="text-lg text-rune">ᚲ</span>
            </div>
            <h1 className="font-display text-lg font-semibold text-white">Kulturarv Chat</h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="text-sm text-stone-400 hover:text-white transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Source toggles */}
      <div className="sticky top-[57px] z-10 bg-stone-900/60 backdrop-blur-lg border-b border-stone-800/30">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-stone-500 mr-1">Sources:</span>
            {(Object.keys(SOURCE_INFO) as Source[]).map((source) => (
              <button
                key={source}
                onClick={() => toggleSource(source)}
                className={`source-toggle border ${
                  sources.includes(source) 
                    ? 'source-toggle-active ' + SOURCE_INFO[source].color
                    : 'source-toggle-inactive border-stone-700/50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  sources.includes(source) ? 'bg-current' : 'bg-stone-600'
                }`} />
                <span className="text-sm">{SOURCE_INFO[source].name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-stone-800/50 border border-stone-700/50 mb-6">
                <span className="text-4xl text-rune">ᚲ</span>
              </div>
              <h2 className="font-display text-2xl text-white mb-3">
                Velkommen til Kulturarv Chat
              </h2>
              <p className="text-stone-400 max-w-md mx-auto mb-6">
                Still spørsmål om norsk kulturarv, historiske steder, kulturminner og mer.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Fortell meg om vikingskip i Norge',
                  'Hva er stavkirker?',
                  'Kulturminner i Oslo',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2 bg-stone-800/50 hover:bg-stone-800 border border-stone-700/50 
                             rounded-full text-sm text-stone-300 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-bubble ${
                message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
              }`}
            >
              <div className="prose-chat whitespace-pre-wrap">{message.content}</div>
              
              {message.sourcesConsulted && message.sourcesConsulted.length > 0 && (
                <div className="mt-3 pt-3 border-t border-stone-700/50 flex flex-wrap gap-1.5">
                  {message.sourcesConsulted.map((source) => (
                    <span
                      key={source}
                      className={`source-badge border ${
                        SOURCE_INFO[source as Source]?.color || 'bg-stone-700/50 text-stone-300'
                      }`}
                    >
                      {SOURCE_INFO[source as Source]?.name || source}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="chat-bubble chat-bubble-assistant">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-fjord-500 rounded-full animate-pulse-soft" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-fjord-500 rounded-full animate-pulse-soft" style={{ animationDelay: '200ms' }} />
                  <span className="w-2 h-2 bg-fjord-500 rounded-full animate-pulse-soft" style={{ animationDelay: '400ms' }} />
                </div>
                <span className="text-sm text-stone-400">Searching sources...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm animate-slide-up">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-gradient-to-t from-stone-900 via-stone-900/95 to-transparent pt-4">
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <form onSubmit={handleSend} className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={sources.length === 0 ? "Select at least one source..." : "Ask about Norwegian cultural heritage..."}
              disabled={isLoading || sources.length === 0}
              rows={1}
              className="input-field pr-14 resize-none min-h-[52px] max-h-[200px]"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 200) + 'px';
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || sources.length === 0}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center
                       bg-fjord-600 hover:bg-fjord-500 disabled:bg-stone-700 disabled:cursor-not-allowed
                       rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
          <p className="text-xs text-stone-600 text-center mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
