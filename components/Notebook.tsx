import React, { useState, useRef } from 'react';
import { Search, FileText, Globe, Video, Mic, Plus, Loader, Database, Sparkles, ArrowRight, Quote, Layers, CheckCircle } from 'lucide-react';
import { MOCK_SOURCES } from '../services/mockData';
import { Source } from '../types';

interface RetrievedChunk {
  id: string;
  sourceId: string;
  sourceTitle: string;
  score: number;
  text: string;
  type: string;
}

const Notebook: React.FC = () => {
  const [sources, setSources] = useState<Source[]>(MOCK_SOURCES);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [ragResult, setRagResult] = useState<{ answer: string; chunks: RetrievedChunk[] } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddSourceClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newSource: Source = {
        id: `s-${Date.now()}`,
        title: file.name,
        type: 'text', // Default to text for mock
        status: 'processing',
        updatedAt: 'Just now',
        size: `${(file.size / 1024).toFixed(0)} KB`
      };

      setSources(prev => [newSource, ...prev]);

      // Simulate processing
      setTimeout(() => {
        setSources(prev => prev.map(s => s.id === newSource.id ? { ...s, status: 'ready' } : s));
      }, 2000);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setRagResult(null);

    // Simulate RAG Latency and Retrieval
    setTimeout(() => {
      setRagResult({
        answer: "Based on the Q3 Financial Report and Competitor Analysis, we are seeing a strong 15% growth in the enterprise sector. However, competitors are pivoting aggressively to video-first marketing strategies which we currently lack in our 2025 Roadmap.",
        chunks: [
          { 
            id: 'c1', 
            sourceId: 's1', 
            sourceTitle: 'Q3_Financial_Report.pdf', 
            score: 0.95, 
            text: "Enterprise revenue grew by 15% QoQ, driven by the adoption of the v2 API suite. Churn reduced by 3% in this segment.",
            type: 'pdf'
          },
          { 
            id: 'c2', 
            sourceId: 's3', 
            sourceTitle: 'Competitor Analysis - YouTube', 
            score: 0.82, 
            text: "[Transcript 04:20] Key competitors are investing heavily in short-form video content to capture early-stage leads...",
            type: 'video'
          },
          { 
            id: 'c3', 
            sourceId: 's2', 
            sourceTitle: 'Product_Roadmap_2025.docx', 
            score: 0.68, 
            text: "Q4 Objective: Launch the video marketing campaign tools to counter competitor moves identified in Q3.",
            type: 'text'
          }
        ]
      });
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex bg-brand-dark text-white">
      {/* Sidebar: Sources List */}
      <div className="w-80 border-r border-brand-surfaceHighlight flex flex-col bg-brand-surface/30">
        <div className="p-6 border-b border-brand-surfaceHighlight">
          <h2 className="text-xl font-bold mb-4 flex items-center">
             <Database className="mr-2 text-brand-primary" size={20} />
             Knowledge Base
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Filter sources..."
              className="w-full bg-brand-dark border border-brand-surfaceHighlight rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {sources.map((source) => (
            <div key={source.id} className="p-4 bg-brand-surface border border-brand-surfaceHighlight rounded-xl hover:border-brand-primary cursor-pointer transition-all group">
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${
                  source.type === 'pdf' ? 'bg-red-500/10 text-red-500' :
                  source.type === 'url' ? 'bg-blue-500/10 text-blue-500' :
                  source.type === 'video' ? 'bg-pink-500/10 text-pink-500' :
                  'bg-gray-500/10 text-gray-400'
                }`}>
                  {source.type === 'pdf' && <FileText size={18} />}
                  {source.type === 'url' && <Globe size={18} />}
                  {source.type === 'video' && <Video size={18} />}
                  {source.type === 'text' && <FileText size={18} />}
                </div>
                {source.status === 'processing' ? (
                  <span className="flex items-center text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                    <Loader size={10} className="animate-spin mr-1" /> Processing
                  </span>
                ) : (
                  <span className="text-xs text-brand-success bg-brand-success/10 px-2 py-1 rounded-full">Ready</span>
                )}
              </div>
              <h3 className="font-medium text-sm text-gray-200 truncate group-hover:text-brand-primary transition-colors">{source.title}</h3>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{source.size || 'Unknown'}</span>
                <span>{source.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-brand-surfaceHighlight">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
          />
          <button 
            onClick={handleAddSourceClick}
            className="w-full flex items-center justify-center space-x-2 bg-brand-primary text-white py-3 rounded-xl hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20"
          >
            <Plus size={18} />
            <span>Add Source</span>
          </button>
        </div>
      </div>

      {/* Main Content: RAG Query Interface */}
      <div className="flex-1 flex flex-col bg-brand-dark relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />

         <div className="flex-1 overflow-y-auto p-8 z-10 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header & Search */}
                <div className="text-center space-y-6 mt-8">
                    <h1 className="text-3xl font-bold text-white">Query Your Knowledge</h1>
                    <p className="text-gray-400">Semantic search across {sources.length} documents and {sources.length * 240} vector chunks.</p>
                    
                    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                        <div className="absolute left-4 top-4 text-gray-400">
                            <Sparkles size={24} />
                        </div>
                        <input 
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask a question about financial reports or roadmaps..."
                            className="w-full bg-brand-surface border border-brand-surfaceHighlight rounded-2xl py-4 pl-14 pr-16 text-lg text-white shadow-2xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all placeholder-gray-500"
                        />
                        <button 
                            type="submit"
                            disabled={!query.trim() || isSearching}
                            className={`absolute right-2 top-2 bottom-2 aspect-square rounded-xl flex items-center justify-center transition-all ${
                                query.trim() && !isSearching ? 'bg-brand-primary text-white hover:bg-brand-primary/90' : 'bg-brand-surfaceHighlight/50 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {isSearching ? <Loader size={20} className="animate-spin" /> : <ArrowRight size={24} />}
                        </button>
                    </form>
                </div>

                {/* Results Area */}
                {ragResult && (
                    <div className="space-y-8 animate-fade-in pb-20">
                        {/* AI Answer */}
                        <div className="bg-gradient-to-br from-brand-surface to-brand-surface/50 border border-brand-surfaceHighlight rounded-2xl p-8 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-accent" />
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-accent">
                                    <Sparkles size={20} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-white text-lg">Generated Insight</h3>
                                    <p className="text-gray-200 leading-relaxed text-lg">{ragResult.answer}</p>
                                </div>
                            </div>
                        </div>

                        {/* Source Chunks */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                                <Layers size={16} className="mr-2" />
                                Retrieved Context ({ragResult.chunks.length})
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {ragResult.chunks.map((chunk) => (
                                    <div key={chunk.id} className="bg-brand-surface border border-brand-surfaceHighlight rounded-xl p-6 hover:border-brand-primary/50 transition-all group">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <div className={`p-1.5 rounded-lg ${
                                                    chunk.type === 'pdf' ? 'bg-red-500/10 text-red-500' :
                                                    chunk.type === 'url' ? 'bg-blue-500/10 text-blue-500' :
                                                    chunk.type === 'video' ? 'bg-pink-500/10 text-pink-500' :
                                                    'bg-gray-500/10 text-gray-400'
                                                }`}>
                                                    {chunk.type === 'pdf' && <FileText size={14} />}
                                                    {chunk.type === 'video' && <Video size={14} />}
                                                    {chunk.type === 'text' && <FileText size={14} />}
                                                </div>
                                                <span className="font-semibold text-sm text-brand-accent">{chunk.sourceTitle}</span>
                                            </div>
                                            <span className="text-xs bg-brand-surfaceHighlight px-2 py-1 rounded-full text-gray-300">
                                                Relevance: {(chunk.score * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <Quote size={16} className="absolute -left-1 -top-1 text-brand-surfaceHighlight fill-current" />
                                            <p className="text-gray-400 text-sm pl-4 leading-relaxed font-mono bg-brand-dark/50 p-3 rounded-lg border border-brand-surfaceHighlight/30">
                                                {chunk.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State / Topic Map Preview */}
                {!ragResult && !isSearching && (
                    <div className="mt-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="h-64 bg-brand-surface border border-brand-surfaceHighlight rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-gray-500 font-medium">Topic Map Visualization</p>
                            </div>
                             <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                                {/* Simulated Nodes */}
                                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-pulse" />
                                <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-brand-accent rounded-full opacity-60" />
                                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-500 rounded-full opacity-60" />
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                                    <line x1="50%" y1="50%" x2="33%" y2="25%" stroke="white" strokeWidth="1" />
                                    <line x1="50%" y1="50%" x2="75%" y2="66%" stroke="white" strokeWidth="1" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Notebook;