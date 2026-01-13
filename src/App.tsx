import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Source, SOURCE_INFO, ToolStatus, SourceReference, getToolDisplayName, getToolProvider } from './types';
import { sendMessageStream, ApiError } from './api';
import { useLanguage } from './i18n';
import { getRandomQuestionIndices, getQuestionText, SelectedQuestion } from './questions';

// ChatKit-styled icons
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);

const StopIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" />
    <path d="M19 15L19.94 17.06L22 18L19.94 18.94L19 21L18.06 18.94L16 18L18.06 17.06L19 15Z" />
    <path d="M5 17L5.5 18.5L7 19L5.5 19.5L5 21L4.5 19.5L3 19L4.5 18.5L5 17Z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const LoaderIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
  </svg>
);

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);


const SourceIcon = ({ source }: { source: Source }) => {
  if (source === 'wikipedia') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.436 0 .135.053.33.166.601 1.082 2.646 4.818 10.521 4.818 10.521l.136.046 2.411-4.81-.482-1.067-1.658-3.264s-.318-.654-.428-.872c-.728-1.443-.712-1.518-1.447-1.617-.207-.023-.313-.05-.313-.149v-.468l.06-.045h4.292l.113.037v.451c0 .105-.076.15-.227.15l-.308.047c-.792.061-.661.381-.136 1.422l1.582 3.252 1.758-3.504c.293-.64.233-.801.111-.947-.07-.084-.305-.22-.812-.24l-.201-.021c-.052 0-.098-.015-.145-.051-.045-.031-.067-.076-.067-.129v-.427l.061-.045c1.247-.008 4.043 0 4.043 0l.059.045v.436c0 .121-.059.178-.193.178-.646.03-.782.095-1.023.439-.12.186-.375.589-.646 1.039l-2.301 4.273-.065.135 2.792 5.712.17.048 4.396-10.438c.154-.422.129-.722-.064-.895-.197-.172-.346-.273-.857-.295l-.42-.016c-.061 0-.105-.014-.152-.045-.043-.029-.072-.075-.072-.119v-.436l.059-.045h4.961l.041.045v.437c0 .119-.074.18-.209.18-.648.03-1.127.18-1.443.421-.314.255-.557.616-.736 1.067 0 0-4.043 9.258-5.426 12.339-.525 1.007-1.053.917-1.503-.031-.571-1.171-1.773-3.786-2.646-5.71l.053-.036z" />
      </svg>
    );
  }
  if (source === 'snl') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
    </svg>
  );
};

// Language switcher component
const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <button 
      className="chatkit-language-switcher"
      onClick={() => setLanguage(language === 'no' ? 'en' : 'no')}
      title={language === 'no' ? 'Switch to English' : 'Bytt til norsk'}
    >
      <GlobeIcon />
      <span>{language === 'no' ? 'NO' : 'EN'}</span>
    </button>
  );
};

// Tool status indicator showing which source is being explored
const ToolStatusIndicator = ({ status }: { status: ToolStatus }) => {
  const provider = getToolProvider(status.tool);
  const displayName = getToolDisplayName(status.tool);
  
  return (
    <div className={`chatkit-tool-status ${status.status}`} data-provider={provider}>
      <div className="chatkit-tool-status-icon">
        {status.status === 'calling' ? <LoaderIcon /> : <CheckIcon />}
      </div>
      <span className="chatkit-tool-status-name">{displayName}</span>
    </div>
  );
};

// Source card component
const SourceCard = ({ source }: { source: SourceReference }) => {
  const provider = source.provider as Source;
  
  return (
    <a 
      href={source.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="chatkit-source-card"
      data-provider={provider}
    >
      <div className="chatkit-source-card-icon">
        <SourceIcon source={provider} />
      </div>
      <div className="chatkit-source-card-content">
        <div className="chatkit-source-card-title">{source.title}</div>
        {source.snippet && (
          <div className="chatkit-source-card-snippet">{source.snippet}</div>
        )}
      </div>
      <div className="chatkit-source-card-link">
        <LinkIcon />
      </div>
    </a>
  );
};

// Related query chip
const RelatedQueryChip = ({ query, onClick }: { query: string; onClick: () => void }) => (
  <button className="chatkit-related-query" onClick={onClick}>
    {query}
  </button>
);


// Regenerate menu component with bilingual support
const RegenerateMenu = ({
  onRegenerate,
  onRegenerateWithSources,
  currentSources
}: {
  onRegenerate: () => void;
  onRegenerateWithSources: (sources: Source[]) => void;
  currentSources: Source[];
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<Source[]>(currentSources);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSource = (source: Source) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  return (
    <div className="chatkit-regenerate-menu" ref={menuRef}>
      <button 
        className="chatkit-action-button"
        onClick={() => setIsOpen(!isOpen)}
        title={t('regenerate')}
      >
        <RefreshIcon />
      </button>
      
      {isOpen && (
        <div className="chatkit-regenerate-dropdown">
          <button 
            className="chatkit-regenerate-option"
            onClick={() => {
              onRegenerate();
              setIsOpen(false);
            }}
          >
            <RefreshIcon />
            <span>{t('regenerate')}</span>
          </button>
          
          <div className="chatkit-regenerate-divider" />
          
          <div className="chatkit-regenerate-sources-header">{t('regenerateWithSources')}</div>
          
          {(Object.keys(SOURCE_INFO) as Source[]).map((source) => (
            <button
              key={source}
              type="button"
              className={`chatkit-source-option compact ${selectedSources.includes(source) ? 'active' : ''}`}
              onClick={() => toggleSource(source)}
              data-source={source}
            >
              <div className={`chatkit-source-checkbox ${selectedSources.includes(source) ? 'checked' : ''}`}>
                {selectedSources.includes(source) && <CheckIcon />}
              </div>
              <SourceIcon source={source} />
              <span>{SOURCE_INFO[source].name}</span>
            </button>
          ))}
          
          <button 
            className="chatkit-regenerate-submit"
            onClick={() => {
              onRegenerateWithSources(selectedSources);
              setIsOpen(false);
            }}
            disabled={selectedSources.length === 0}
          >
            {t('regenerateWith')} {selectedSources.length} {selectedSources.length !== 1 ? 'sources' : 'source'}
          </button>
        </div>
      )}
    </div>
  );
};


function App() {
  const { t, language } = useLanguage();
  const [token, setToken] = useState(() => localStorage.getItem('kulturarv_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>(['wikipedia', 'snl', 'riksantikvaren']);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  // Stop generation
  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setStatusMessage(null);
      
      // Mark the streaming message as stopped
      setMessages(prev => prev.map(msg => 
        msg.isStreaming 
          ? { ...msg, isStreaming: false, content: msg.content || t('generationStopped') }
          : msg
      ));
    }
  }, [t]);

  const handleSend = useCallback(async (messageText?: string, customSources?: Source[], userMessageId?: string) => {
    const text = messageText || input.trim();
    const sourcesToUse = customSources || sources;
    if (!text || isLoading || sourcesToUse.length === 0) return;

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    const userMessage: Message = {
      id: userMessageId || crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    // Create placeholder for assistant response
    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
      toolStatuses: [],
    };

    // If we have a userMessageId, we're regenerating - replace from that point
    if (userMessageId) {
      setMessages(prev => {
        const userIndex = prev.findIndex(m => m.id === userMessageId);
        if (userIndex >= 0) {
          // Keep messages before the user message, update user message, add new assistant
          return [...prev.slice(0, userIndex), userMessage, assistantMessage];
        }
        return [...prev, userMessage, assistantMessage];
      });
    } else {
      setMessages(prev => [...prev, userMessage, assistantMessage]);
    }
    
    setInput('');
    setIsLoading(true);
    setError(null);
    setStatusMessage(t('analyzingQuestion'));

    try {
      const history = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }));

      await sendMessageStream(token, {
        message: text,
        sources: sourcesToUse,
        conversation_history: history,
      }, {
        onStatus: () => {
          // Keep showing analyzing status
          setStatusMessage(t('analyzingQuestion'));
        },
        onToolStart: (tool) => {
          // Show exploring sources status
          setStatusMessage(t('exploringSources'));
          
          // Add tool to status list
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  toolStatuses: [
                    ...(msg.toolStatuses || []),
                    { tool, status: 'calling' as const }
                  ]
                }
              : msg
          ));
        },
        onToolEnd: (tool, success, preview) => {
          // Keep showing exploring sources
          setStatusMessage(t('exploringSources'));
          
          // Update tool status
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  toolStatuses: (msg.toolStatuses || []).map(ts =>
                    ts.tool === tool
                      ? { ...ts, status: success ? 'completed' as const : 'failed' as const, preview }
                      : ts
                  )
                }
              : msg
          ));
        },
        onToken: (content) => {
          // Update status to show we're generating
          setStatusMessage(t('generatingResponse'));
          
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + content }
              : msg
          ));
        },
        onDone: (response) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: response.response.text,
                  isStreaming: false,
                  sources: response.sources,
                  locations: response.locations,
                  relatedQueries: response.related_queries,
                  toolsUsed: response.metadata.tools_used,
                  providersConsulted: response.metadata.providers_consulted,
                  processingTimeMs: response.metadata.processing_time_ms,
                }
              : msg
          ));
          setStatusMessage(null);
        },
        onError: (message) => {
          setError(message);
          setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
        },
      }, abortControllerRef.current.signal);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was aborted, don't show error
        return;
      }
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setIsAuthenticated(false);
          setError(t('invalidToken'));
        } else {
          setError(err.message);
        }
      } else {
        setError(t('unexpectedError'));
      }
      // Remove the placeholder message on error
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
    } finally {
      setIsLoading(false);
      setStatusMessage(null);
      abortControllerRef.current = null;
    }
  }, [input, isLoading, sources, token, messages, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRelatedQuery = (query: string) => {
    handleSend(query);
  };

  // Edit message handlers
  const startEditing = (message: Message) => {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const submitEdit = () => {
    if (!editingMessageId || !editingContent.trim()) return;
    
    // Find the message being edited and resend with new content
    handleSend(editingContent.trim(), sources, editingMessageId);
    cancelEditing();
  };

  // Regenerate handlers
  const handleRegenerate = (userMessageId: string, userContent: string) => {
    handleSend(userContent, sources, userMessageId);
  };

  const handleRegenerateWithSources = (userMessageId: string, userContent: string, newSources: Source[]) => {
    handleSend(userContent, newSources, userMessageId);
  };

  // Get the user message that corresponds to an assistant message
  const getUserMessageForAssistant = (assistantIndex: number): Message | null => {
    for (let i = assistantIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        return messages[i];
      }
    }
    return null;
  };

  // Store question indices - only regenerate when sources change or refresh clicked
  const [suggestionIndices, setSuggestionIndices] = useState<SelectedQuestion[]>(() => 
    getRandomQuestionIndices(sources, 6)
  );
  
  // Regenerate suggestions when sources change
  useEffect(() => {
    setSuggestionIndices(getRandomQuestionIndices(sources, 6));
  }, [sources]);
  
  // Refresh suggestions manually
  const refreshSuggestions = useCallback(() => {
    setSuggestionIndices(getRandomQuestionIndices(sources, 6));
  }, [sources]);

  // Auth screen
  if (!isAuthenticated) {
    return (
      <div className="chatkit-container">
        <div className="chatkit-auth-card animate-fade-in">
          <div className="chatkit-auth-header">
            <div className="chatkit-auth-top-bar">
              <LanguageSwitcher />
            </div>
            <div className="chatkit-logo">
              <SparkleIcon />
            </div>
            <h1 className="chatkit-auth-title">{t('authTitle')}</h1>
            <p className="chatkit-auth-subtitle">
              {t('authSubtitle')}
            </p>
          </div>
          
          <form onSubmit={handleAuth} className="chatkit-auth-form">
            <div className="chatkit-input-group">
              <label htmlFor="token" className="chatkit-label">
                {t('accessToken')}
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder={t('enterToken')}
                className="chatkit-input"
                autoFocus
              />
              <p className="chatkit-hint">
                {t('tokenHint')}
              </p>
            </div>
            
            {error && (
              <div className="chatkit-error">
                {error}
              </div>
            )}
            
            <button type="submit" className="chatkit-button-primary">
              <SparkleIcon />
              {t('startExploring')}
            </button>
          </form>
          
          <div className="chatkit-auth-footer">
            <p>{t('poweredBy')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Chat screen
  return (
    <div className="chatkit-app">
      {/* Header */}
      <header className="chatkit-header">
        <div className="chatkit-header-content">
          <div className="chatkit-header-left">
            <div className="chatkit-header-logo">
              <SparkleIcon />
            </div>
            <div className="chatkit-header-title">
              <h1>{t('authTitle')}</h1>
              <span className="chatkit-header-status">
                <span className="chatkit-status-dot" />
                {t('connected')}
              </span>
            </div>
          </div>
          
          <div className="chatkit-header-right">
            <LanguageSwitcher />
            <button onClick={handleLogout} className="chatkit-header-action" title={t('logOut')}>
              <LogoutIcon />
          </button>
          </div>
        </div>
      </header>

      {/* Messages area */}
      <div className="chatkit-messages-container">
        <div className="chatkit-messages">
          {messages.length === 0 && (
            <div className="chatkit-welcome animate-fade-in">
              <div className="chatkit-welcome-icon">
                <SparkleIcon />
              </div>
              <h2>{t('welcomeTitle')}</h2>
              <p>{t('welcomeDescription')}</p>
              
              <div className="chatkit-suggestions-container">
                <div className="chatkit-suggestions">
                  {suggestionIndices.map((selection, index) => {
                    const text = getQuestionText(selection, language);
                    return (
                      <button
                        key={`${selection.source}-${selection.index}-${index}`}
                        onClick={() => handleSend(text)}
                        className="chatkit-suggestion"
                        data-source={selection.source}
                      >
                        {text}
                      </button>
                    );
                  })}
                </div>
                  <button
                  className="chatkit-refresh-button"
                  onClick={refreshSuggestions}
                  title={language === 'no' ? 'Nye forslag' : 'New suggestions'}
                >
                  <RefreshIcon />
                  <span>{language === 'no' ? 'Nye forslag' : 'New suggestions'}</span>
                  </button>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`chatkit-message ${message.role}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {message.role === 'assistant' && (
                <div className="chatkit-message-avatar">
                  <SparkleIcon />
                </div>
              )}
              <div className="chatkit-message-content">
                {/* Tool statuses - show which sources are being explored */}
                {message.toolStatuses && message.toolStatuses.length > 0 && (
                  <div className="chatkit-tool-statuses">
                    {message.toolStatuses.map((status, i) => (
                      <ToolStatusIndicator key={`${status.tool}-${i}`} status={status} />
                    ))}
                  </div>
                )}
                
                {/* Show status message instead of empty bubble for streaming messages */}
                {message.role === 'assistant' && message.isStreaming && !message.content ? (
                  <div className="chatkit-streaming-status">
                    <LoaderIcon />
                    <span>{statusMessage || t('analyzingQuestion')}</span>
                  </div>
                ) : (
                  <div className="chatkit-message-bubble">
                    {/* Edit mode for user messages */}
                    {message.role === 'user' && editingMessageId === message.id ? (
                      <div className="chatkit-edit-container">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="chatkit-edit-textarea"
                          autoFocus
                        />
                        <div className="chatkit-edit-actions">
                          <button onClick={cancelEditing} className="chatkit-edit-cancel">
                            {t('cancel')}
                          </button>
                          <button onClick={submitEdit} className="chatkit-edit-submit">
                            {t('send')}
                          </button>
                        </div>
                      </div>
                    ) : message.role === 'assistant' ? (
                      <div className="chatkit-message-text prose">
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
                        {message.isStreaming && <span className="chatkit-cursor">▌</span>}
                      </div>
                    ) : (
                      <div className="chatkit-message-text">{message.content}</div>
                    )}
                  </div>
                )}
                
                {/* Sources - outside bubble */}
                {message.sources && message.sources.length > 0 && !message.isStreaming && (
                  <div className="chatkit-message-sources-section">
                    <div className="chatkit-sources-header">
                      <LinkIcon />
                      <span>{t('sources')}</span>
                    </div>
                    <div className="chatkit-source-cards">
                      {message.sources.map((source, i) => (
                        <SourceCard key={`${source.url}-${i}`} source={source} />
                      ))}
                    </div>
            </div>
                )}
                
                {/* Related queries - outside bubble */}
                {message.relatedQueries && message.relatedQueries.length > 0 && !message.isStreaming && (
                  <div className="chatkit-related-queries">
                    <div className="chatkit-related-header">{t('relatedQuestions')}</div>
                    <div className="chatkit-related-list">
                      {message.relatedQueries.map((query, i) => (
                        <RelatedQueryChip 
                          key={i} 
                          query={query} 
                          onClick={() => handleRelatedQuery(query)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Processing time */}
                {message.processingTimeMs && !message.isStreaming && (
                  <div className="chatkit-message-meta">
                    {(message.processingTimeMs / 1000).toFixed(1)}s
                  </div>
                )}

                {/* Message actions */}
                {!message.isStreaming && editingMessageId !== message.id && (
                  <div className="chatkit-message-actions">
                    {message.role === 'user' && (
                      <button 
                        className="chatkit-action-button"
                        onClick={() => startEditing(message)}
                        title={t('editMessage')}
                      >
                        <EditIcon />
                      </button>
                    )}
                    {message.role === 'assistant' && !message.isStreaming && (
                      <>
                        {(() => {
                          const userMsg = getUserMessageForAssistant(index);
                          if (userMsg) {
                            return (
                              <RegenerateMenu
                                onRegenerate={() => handleRegenerate(userMsg.id, userMsg.content)}
                                onRegenerateWithSources={(newSources) => 
                                  handleRegenerateWithSources(userMsg.id, userMsg.content, newSources)
                                }
                                currentSources={sources}
                              />
                            );
                          }
                          return null;
                        })()}
                      </>
                    )}
                </div>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="chatkit-error-message animate-slide-up">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="chatkit-input-area">
        <form onSubmit={handleSubmit} className="chatkit-input-form">
          {/* Source chips above input */}
          <div className="chatkit-input-sources">
            {(Object.keys(SOURCE_INFO) as Source[]).map((source) => (
              <button
                key={source}
                type="button"
                className={`chatkit-input-source-chip ${sources.includes(source) ? 'active' : ''}`}
                onClick={() => toggleSource(source)}
                disabled={isLoading}
                data-source={source}
              >
                <SourceIcon source={source} />
                <span>{SOURCE_INFO[source].name}</span>
                {sources.includes(source) && (
                  <span className="chatkit-input-source-check">
                    <CheckIcon />
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="chatkit-input-wrapper">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={sources.length === 0 ? t('selectSource') : t('askPlaceholder')}
              disabled={isLoading || sources.length === 0}
              rows={1}
              className="chatkit-textarea"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 150) + 'px';
              }}
            />
            {isLoading ? (
              <button
                type="button"
                onClick={handleStopGeneration}
                className="chatkit-stop-button"
                title={t('stopGeneration')}
              >
                <StopIcon />
              </button>
            ) : (
            <button
              type="submit"
                disabled={!input.trim() || sources.length === 0}
                className="chatkit-send-button"
              >
                <SendIcon />
            </button>
            )}
          </div>
          <p className="chatkit-input-hint">
            {t('inputHint')}
          </p>
        </form>
      </div>
    </div>
  );
}

export default App;
