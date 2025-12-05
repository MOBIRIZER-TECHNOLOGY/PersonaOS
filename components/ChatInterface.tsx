import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, User, Bot, RefreshCw, X, MoreHorizontal, ChevronDown, Check, Sparkles, Search, Plus, Edit, MessageSquare, Trash2 } from 'lucide-react';
import { MOCK_PERSONAS } from '../services/mockData';
import { ChatMessage, Persona } from '../types';

interface ChatInterfaceProps {
  personas?: Persona[];
}

interface ConversationSummary {
  id: string;
  personaId: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const MOCK_CONVERSATIONS: ConversationSummary[] = [
  { id: 'c1', personaId: 'p1', lastMessage: "I've analyzed that request based on my parameters.", timestamp: '10:42 AM', unread: 0 },
  { id: 'c2', personaId: 'p2', lastMessage: "The obstacle is the way.", timestamp: 'Yesterday', unread: 2 },
  { id: 'c3', personaId: 'p3', lastMessage: "Try running `pip install pandas` first.", timestamp: 'Mon', unread: 0 },
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ personas = MOCK_PERSONAS }) => {
  // State for Conversations
  const [conversations, setConversations] = useState<ConversationSummary[]>(MOCK_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>('c1');
  const [searchTerm, setSearchTerm] = useState('');

  // Determine Active Persona based on Conversation, fallback to first in list
  const getInitialPersona = () => {
    const conv = MOCK_CONVERSATIONS.find(c => c.id === 'c1');
    if (conv) return personas.find(p => p.id === conv.personaId) || personas[0];
    return personas[0];
  };

  const [activePersona, setActivePersona] = useState<Persona>(getInitialPersona());
  
  // Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'init-1', 
      role: 'system', 
      content: `Persona initialized: ${activePersona.name} (${activePersona.role}). Knowledge base loaded.`, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    },
    { 
      id: 'init-2', 
      role: 'assistant', 
      content: `Hello. I am ${activePersona.name}. How can I assist you with ${activePersona.role} tasks today?`, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => {
           const current = prev.trim();
           return current ? `${current} ${transcript}` : transcript;
        });
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
        console.warn('Speech recognition not supported in this environment');
        return;
    }
    if (isListening) {
        recognitionRef.current.stop();
    } else {
        recognitionRef.current.start();
    }
  };

  // Handle switching conversations
  const handleConversationSelect = (convId: string) => {
    setActiveConversationId(convId);
    const conv = conversations.find(c => c.id === convId);
    if (conv) {
      const newPersona = personas.find(p => p.id === conv.personaId);
      if (newPersona) {
        setActivePersona(newPersona);
        // Reset messages to simulate loading that conversation
        setMessages([
          { 
            id: `restored-${Date.now()}`, 
            role: 'system', 
            content: `Restored conversation context with ${newPersona.name}.`, 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          },
          { 
            id: `last-msg-${Date.now()}`, 
            role: 'assistant', 
            content: conv.lastMessage.includes("analyzed") ? "Here is the analysis you requested earlier." : conv.lastMessage, 
            timestamp: conv.timestamp 
          }
        ]);
        if (conv.unread > 0) {
            setConversations(prev => prev.map(c => c.id === convId ? { ...c, unread: 0 } : c));
        }
      }
    }
  };

  // Create new chat
  const handleNewChat = () => {
      // Logic to create new chat - for UI demo we just reset
      const newId = `c-${Date.now()}`;
      const defaultPersona = personas[0];
      
      const newConv: ConversationSummary = {
          id: newId,
          personaId: defaultPersona.id,
          lastMessage: "New Conversation Started",
          timestamp: "Just now",
          unread: 0
      };
      
      setConversations([newConv, ...conversations]);
      setActiveConversationId(newId);
      setActivePersona(defaultPersona);
      setMessages([{ 
          id: 'new-1', 
          role: 'assistant', 
          content: `Hello! I'm ${defaultPersona.name}. How can I help you today?`, 
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
  };

  const handlePersonaChange = (persona: Persona) => {
    setActivePersona(persona);
    setIsDropdownOpen(false);
    
    // Update current conversation's persona reference
    setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, personaId: persona.id } : c));

    setMessages([
      { 
        id: Date.now().toString(), 
        role: 'system', 
        content: `Switched to persona: ${persona.name}. Context refreshed.`, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      },
      { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: `Greetings. I am ready to help as your ${persona.role}.`, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    // Update conversation preview
    setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, lastMessage: input, timestamp: 'Just now' } : c));
    
    setInput('');
    setIsThinking(true);

    // Simulate RAG + GenAI latency
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `[${activePersona.name}]: I've analyzed that request based on my ${activePersona.role} parameters. The data suggests a positive trend in the uploaded documents.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [{ sourceId: 's1', text: 'Q3 Financial Report, Page 4' }]
      };
      setMessages(prev => [...prev, aiMsg]);
      setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, lastMessage: aiMsg.content, timestamp: 'Just now' } : c));
      setIsThinking(false);
    }, 2000);
  };

  const handleDeleteMessage = (msgId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== msgId));
  };

  // Filter for sidebar
  const filteredConversations = conversations.filter(c => {
      const p = personas.find(per => per.id === c.personaId);
      const searchLower = searchTerm.toLowerCase();
      return p?.name.toLowerCase().includes(searchLower) || c.lastMessage.toLowerCase().includes(searchLower);
  });

  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden">
      
      {/* Conversations Sidebar */}
      <div className="w-80 flex flex-col border-r border-brand-surfaceHighlight bg-brand-surface/20">
         <div className="p-4 border-b border-brand-surfaceHighlight">
             <div className="flex justify-between items-center mb-4">
                 <h2 className="font-bold text-white text-lg flex items-center gap-2">
                    <MessageSquare size={20} className="text-brand-primary" />
                    Messages
                 </h2>
                 <button 
                    onClick={handleNewChat}
                    className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-all shadow-lg hover:shadow-brand-primary/20"
                 >
                     <Edit size={18} />
                 </button>
             </div>
             <div className="relative">
                 <Search className="absolute left-3 top-2.5 text-gray-500" size={14} />
                 <input 
                    type="text" 
                    placeholder="Search conversations..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-surfaceHighlight rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder-gray-600"
                 />
             </div>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar">
             {filteredConversations.map(conv => {
                 const p = personas.find(per => per.id === conv.personaId) || personas[0];
                 const isActive = activeConversationId === conv.id;
                 return (
                     <div 
                        key={conv.id}
                        onClick={() => handleConversationSelect(conv.id)}
                        className={`p-4 border-b border-brand-surfaceHighlight/30 cursor-pointer transition-all hover:bg-brand-surfaceHighlight/20 relative group ${
                            isActive ? 'bg-brand-surfaceHighlight/20' : ''
                        }`}
                     >
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary" />}
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-brand-dark overflow-hidden border border-brand-surfaceHighlight">
                                    {p.avatarUrl ? <img src={p.avatarUrl} alt="" className="w-full h-full object-cover" /> : <Bot size={12} />}
                                </div>
                                <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>{p.name}</span>
                            </div>
                            <span className="text-[10px] text-gray-500">{conv.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 pl-8 leading-relaxed">
                            {conv.unread > 0 ? <span className="font-bold text-white">{conv.lastMessage}</span> : conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-brand-primary/20">
                                {conv.unread}
                            </div>
                        )}
                     </div>
                 );
             })}
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Header with Persona Switcher */}
        <div className="h-16 border-b border-brand-surfaceHighlight flex items-center justify-between px-6 bg-brand-surface/50 backdrop-blur-md relative z-20">
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 group hover:bg-white/5 p-2 rounded-xl transition-all"
            >
               <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-brand-primary/50 transition-all">
                  {activePersona.avatarUrl ? (
                    <img src={activePersona.avatarUrl} alt={activePersona.name} className="w-full h-full object-cover" />
                  ) : (
                    <Bot size={20} className="text-white" />
                  )}
               </div>
               <div className="text-left">
                   <h3 className="font-bold text-white flex items-center gap-2">
                     {activePersona.name}
                     <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                   </h3>
                   <span className="text-xs text-brand-accent flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${activePersona.status === 'training' ? 'bg-yellow-500' : 'bg-brand-success'} animate-pulse`}></span>
                      {activePersona.status === 'training' ? 'Training...' : 'Online'} • {activePersona.role}
                   </span>
               </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-brand-surface border border-brand-surfaceHighlight rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Switch Persona for this Chat
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {personas.map(persona => (
                      <button
                        key={persona.id}
                        onClick={() => handlePersonaChange(persona)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                          activePersona.id === persona.id 
                            ? 'bg-brand-primary/10 text-white' 
                            : 'text-gray-400 hover:bg-brand-surfaceHighlight hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center overflow-hidden">
                              {persona.avatarUrl ? <img src={persona.avatarUrl} alt="" className="w-full h-full object-cover" /> : <Bot size={14} />}
                           </div>
                           <div className="text-left">
                              <div className="text-sm font-medium">{persona.name}</div>
                              <div className="text-[10px] opacity-70">{persona.role}</div>
                           </div>
                        </div>
                        {activePersona.id === persona.id && <Check size={16} className="text-brand-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Backdrop for Dropdown */}
            {isDropdownOpen && (
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setIsDropdownOpen(false)}
              />
            )}
          </div>

          <button onClick={() => setShowRightPanel(!showRightPanel)} className={`text-gray-400 hover:text-white p-2 rounded-lg transition-colors ${showRightPanel ? 'bg-brand-surfaceHighlight/50 text-white' : ''}`}>
            <MoreHorizontal />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex w-full group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                
                <button 
                  onClick={() => handleDeleteMessage(msg.id)}
                  className={`p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all opacity-0 group-hover:opacity-100 self-center`}
                  title="Delete message"
                >
                  <Trash2 size={14} />
                </button>

                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-brand-primary text-white rounded-tr-none shadow-lg shadow-brand-primary/10' 
                      : 'bg-brand-surface border border-brand-surfaceHighlight text-gray-100 rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  
                  {/* Citations */}
                  {msg.citations && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.citations.map((cite, idx) => (
                        <button key={idx} className="text-xs bg-brand-surfaceHighlight/50 border border-brand-accent/20 text-brand-accent px-2 py-1 rounded hover:bg-brand-accent/10 transition-colors">
                          Drafted from: {cite.text}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <span className="text-xs text-gray-500 mt-1 px-1 opacity-70">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
          {isThinking && (
             <div className="flex justify-start">
                <div className="bg-brand-surface border border-brand-surfaceHighlight px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-brand-dark">
          <div className="bg-brand-surface border border-brand-surfaceHighlight rounded-xl p-2 flex items-end shadow-xl transition-all focus-within:border-brand-primary/50">
             <button className="p-3 text-gray-400 hover:text-white transition-colors">
                <Paperclip size={20} />
             </button>
             <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={`Ask ${activePersona.name} anything...`}
                className="flex-1 bg-transparent border-none focus:ring-0 text-white resize-none max-h-32 py-3 px-2 placeholder-gray-500"
                rows={1}
                disabled={activePersona.status === 'training'}
             />
             <button 
               onClick={handleVoiceInput}
               className={`p-3 transition-colors ${
                 isListening 
                   ? 'text-red-500 hover:text-red-400 animate-pulse bg-red-500/10 rounded-lg' 
                   : 'text-gray-400 hover:text-white'
               }`}
               title="Voice Input"
             >
                <Mic size={20} />
             </button>
             <button 
                onClick={handleSend}
                disabled={!input.trim() || activePersona.status === 'training'}
                className={`p-3 rounded-lg transition-all shadow-lg ml-2 ${
                  !input.trim() || activePersona.status === 'training'
                   ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                   : 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-brand-primary/20'
                }`}
             >
                <Send size={20} />
             </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-xs text-gray-600">
              {activePersona.status === 'training' 
                ? 'Persona is currently training. Chat functionality is limited.' 
                : 'AI can make mistakes. Review generated responses.'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Persona State & Context */}
      {showRightPanel && (
        <div className="w-80 bg-brand-surface border-l border-brand-surfaceHighlight p-6 flex flex-col overflow-y-auto shrink-0">
           <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-gray-200">Persona State</h4>
              <button onClick={() => setShowRightPanel(false)} className="text-gray-500 hover:text-white">
                 <X size={18} />
              </button>
           </div>

           {/* Emotional State */}
           <div className="mb-6">
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Emotional Engine</h5>
              <div className="bg-brand-dark p-4 rounded-xl border border-brand-surfaceHighlight space-y-3">
                 <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Tone</span>
                        <span className="text-brand-success">{activePersona.config.identity.tone}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-success w-[80%]"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Cognitive Load</span>
                        <span className="text-yellow-500">Normal</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 w-[30%]"></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Personality Radar Summary */}
           <div className="mb-6">
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Personality Config</h5>
              <div className="flex flex-wrap gap-2">
                 <span className="text-xs bg-brand-surfaceHighlight px-2 py-1 rounded text-gray-300 border border-brand-surfaceHighlight/50">
                    Formal: {activePersona.config.personality.formalCasual}%
                 </span>
                 <span className="text-xs bg-brand-surfaceHighlight px-2 py-1 rounded text-gray-300 border border-brand-surfaceHighlight/50">
                    Direct: {activePersona.config.personality.directDiplomatic}%
                 </span>
                 <span className="text-xs bg-brand-surfaceHighlight px-2 py-1 rounded text-gray-300 border border-brand-surfaceHighlight/50">
                    Analytical: {activePersona.config.personality.analyticalEmotional}%
                 </span>
              </div>
           </div>

           {/* Active Memory */}
           <div className="mb-6">
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Active Context</h5>
              <div className="space-y-2">
                 <div className="bg-brand-primary/10 border border-brand-primary/20 p-3 rounded-lg">
                    <p className="text-xs text-brand-primary font-semibold mb-1">Objective</p>
                    <p className="text-xs text-brand-primary opacity-80">{activePersona.config.identity.objective}</p>
                 </div>
                 <div className="bg-brand-dark border border-brand-surfaceHighlight p-3 rounded-lg">
                    <p className="text-xs text-gray-400 italic">Session context initialized. No long-term memories retrieved yet.</p>
                 </div>
              </div>
           </div>

           {/* Controls */}
           <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Debug Controls</h5>
              <button className="w-full flex items-center justify-center space-x-2 border border-brand-surfaceHighlight text-gray-400 py-2 rounded-lg text-xs hover:bg-brand-surfaceHighlight hover:text-white transition-colors">
                 <RefreshCw size={14} />
                 <span>Reset Context Window</span>
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;