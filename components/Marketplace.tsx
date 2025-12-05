import React, { useState } from 'react';
import { Search, Filter, Star, Download, MessageSquare, ChevronLeft, Shield, Zap, Activity, CheckCircle } from 'lucide-react';
import { MOCK_MARKETPLACE } from '../services/mockData';
import { MarketplaceItem } from '../types';

// Mock reviews for the detail view
const MOCK_REVIEWS = [
  { id: 1, user: "Elena R.", rating: 5, date: "2 days ago", comment: "This persona completely transformed my workflow. The domain knowledge is incredibly deep." },
  { id: 2, user: "J. Smith", rating: 4, date: "1 week ago", comment: "Very responsive and accurate. Would love more customization options in the future." },
  { id: 3, user: "TechLead_88", rating: 5, date: "2 weeks ago", comment: "I use this daily for code reviews. It catches things I miss. Highly recommended." },
];

const categories = ['All', 'Business', 'Health', 'Technology', 'Creative', 'Education', 'Legal'];

const Marketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

  // Detail View Component
  const MarketplaceDetail = ({ item, onBack }: { item: MarketplaceItem, onBack: () => void }) => (
    <div className="h-full flex flex-col bg-brand-dark animate-fade-in">
      {/* Navigation */}
      <div className="p-6 border-b border-brand-surfaceHighlight flex items-center bg-brand-surface/50 backdrop-blur-md sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full bg-brand-surfaceHighlight/50 group-hover:bg-brand-primary/20 mr-3 transition-colors">
            <ChevronLeft size={20} />
          </div>
          <span className="font-medium">Back to Marketplace</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Hero Section */}
        <div className="relative">
           {/* Background Blur */}
           <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-primary/10 to-brand-dark pointer-events-none" />
           
           <div className="max-w-5xl mx-auto px-8 pt-12 pb-8 relative z-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Large Avatar */}
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-brand-surface shadow-2xl shadow-brand-primary/20 bg-brand-surfaceHighlight flex items-center justify-center text-4xl font-bold text-white shrink-0">
                      {item.persona.avatarUrl ? (
                          <img src={item.persona.avatarUrl} alt={item.persona.name} className="w-full h-full object-cover" />
                      ) : (
                          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-accent`}>
                              {item.persona.name.charAt(0)}
                          </div>
                      )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                         {item.tags.map(tag => (
                             <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-surfaceHighlight border border-brand-surfaceHighlight/50 text-gray-300">
                                {tag}
                             </span>
                         ))}
                      </div>
                      
                      <div>
                          <h1 className="text-4xl font-bold text-white mb-2">{item.persona.name}</h1>
                          <p className="text-xl text-brand-accent">{item.persona.role}</p>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                              <Star className="text-yellow-500 fill-current" size={18} />
                              <span className="text-white font-bold">{item.rating}</span>
                              <span>({item.downloads > 1000 ? '1k+' : '50+'} reviews)</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <Download className="text-blue-400" size={18} />
                              <span className="text-white font-bold">{item.downloads.toLocaleString()}</span>
                              <span>Downloads</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <Shield className="text-green-500" size={18} />
                              <span>Verified Author: <span className="text-white hover:underline cursor-pointer">{item.author}</span></span>
                          </div>
                      </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col gap-3 min-w-[200px]">
                      <div className="text-right mb-2">
                          <span className="text-3xl font-bold text-white">{item.price ? `$${item.price}` : 'Free'}</span>
                      </div>
                      <button className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-brand-primary/25 transition-all flex items-center justify-center gap-2">
                          <Download size={20} />
                          Get Persona
                      </button>
                      <button className="w-full py-3 bg-brand-surface border border-brand-surfaceHighlight hover:border-brand-primary/50 text-gray-300 hover:text-white font-medium rounded-xl transition-all">
                          Preview Chat
                      </button>
                  </div>
              </div>
           </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-5xl mx-auto px-8 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column (Main Info) */}
            <div className="lg:col-span-2 space-y-10">
                {/* About */}
                <section>
                    <h3 className="text-xl font-bold text-white mb-4">About this Persona</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        {item.persona.description}
                    </p>
                    <p className="text-gray-400 leading-relaxed mt-4">
                        Trained on specialized datasets including industry standard protocols, recent case studies (2023-2024), and expert methodologies. This persona is designed to act as a senior-level consultant, capable of complex reasoning and strategic advice.
                    </p>
                </section>

                {/* Capabilities */}
                <section>
                    <h3 className="text-xl font-bold text-white mb-4">Capabilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Advanced Reasoning', 'Context Retention (128k)', 'Multi-modal Input', 'Code Generation', 'Data Analysis', 'Creative Writing'].map((cap, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-brand-surface border border-brand-surfaceHighlight">
                                <CheckCircle size={18} className="text-brand-success" />
                                <span className="text-gray-300">{cap}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Reviews */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">User Reviews</h3>
                        <span className="text-brand-primary cursor-pointer hover:underline text-sm">View all 124 reviews</span>
                    </div>
                    <div className="space-y-4">
                        {MOCK_REVIEWS.map(review => (
                            <div key={review.id} className="p-5 rounded-xl bg-brand-surface/50 border border-brand-surfaceHighlight">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-brand-surfaceHighlight flex items-center justify-center text-xs font-bold text-gray-400">
                                            {review.user.charAt(0)}
                                        </div>
                                        <span className="font-semibold text-white">{review.user}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{review.date}</span>
                                </div>
                                <div className="flex text-yellow-500 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-700"} />
                                    ))}
                                </div>
                                <p className="text-gray-300 text-sm">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="space-y-8">
                {/* Configuration Specs */}
                <div className="bg-brand-surface border border-brand-surfaceHighlight rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-brand-accent" />
                        Personality Profile
                    </h3>
                    
                    <div className="space-y-5">
                        {[
                            { label: 'Formality', value: item.persona.config.personality.formalCasual, left: 'Casual', right: 'Formal' },
                            { label: 'Directness', value: item.persona.config.personality.directDiplomatic, left: 'Diplomatic', right: 'Direct' },
                            { label: 'Emotion', value: item.persona.config.personality.analyticalEmotional, left: 'Emotional', right: 'Analytical' },
                        ].map((trait, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                                    <span>{trait.left}</span>
                                    <span className="text-white font-medium">{trait.label}</span>
                                    <span>{trait.right}</span>
                                </div>
                                <div className="h-2 w-full bg-brand-dark rounded-full overflow-hidden border border-brand-surfaceHighlight/50">
                                    <div 
                                        className="h-full bg-brand-primary rounded-full" 
                                        style={{ width: `${trait.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-brand-surfaceHighlight">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Tone</span>
                                <span className="text-white font-medium">{item.persona.config.identity.tone}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Base Model</span>
                                <span className="text-white font-medium">Gemini 2.5 Flash</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Version</span>
                                <span className="text-white font-medium">1.2.4</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Last Update</span>
                                <span className="text-white font-medium">Oct 12, 2024</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Prompt / Objective */}
                <div className="bg-brand-surface border border-brand-surfaceHighlight rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Zap size={20} className="text-yellow-500" />
                        Core Objective
                    </h3>
                    <div className="bg-brand-dark rounded-xl p-4 border border-brand-surfaceHighlight/50">
                        <p className="text-sm text-gray-300 font-mono leading-relaxed">
                            "{item.persona.config.identity.objective}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  if (selectedItem) {
      return <MarketplaceDetail item={selectedItem} onBack={() => setSelectedItem(null)} />;
  }

  // List View
  return (
    <div className="p-8 h-full overflow-y-auto bg-brand-dark animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 inline-block">
            Persona Marketplace
          </h1>
          <p className="text-gray-400 text-lg">
            Discover and deploy expert AI personas built by the community
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto w-full">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Search personas..." 
                className="w-full bg-brand-surface border border-brand-surfaceHighlight rounded-xl pl-12 pr-4 py-3.5 text-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder-gray-600"
              />
           </div>
           <button className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-brand-surface border border-brand-surfaceHighlight rounded-xl text-gray-300 hover:text-white hover:border-brand-primary/50 transition-all">
              <Filter size={18} />
              <span>Filters</span>
           </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 pb-4">
           {categories.map(cat => (
             <button
               key={cat}
               onClick={() => setSelectedCategory(cat)}
               className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                 selectedCategory === cat 
                   ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25' 
                   : 'bg-brand-surface border border-brand-surfaceHighlight text-gray-400 hover:text-white hover:bg-brand-surfaceHighlight'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {MOCK_MARKETPLACE.map((item) => (
             <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="bg-[#0F172A] border border-brand-surfaceHighlight rounded-2xl p-6 hover:border-brand-primary/50 transition-all group flex flex-col relative overflow-hidden cursor-pointer"
             >
                {/* Hover Glow Effect */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-primary/10 transition-all" />

                {/* Top Row: Icon & Badge */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg ${
                     item.tags.includes('Business') ? 'bg-gradient-to-br from-blue-600 to-blue-400' :
                     item.tags.includes('Health') ? 'bg-gradient-to-br from-teal-600 to-teal-400' :
                     item.tags.includes('Technology') ? 'bg-gradient-to-br from-indigo-600 to-indigo-400' :
                     'bg-gradient-to-br from-purple-600 to-purple-400'
                   }`}>
                      {item.persona.avatarUrl ? (
                          <img src={item.persona.avatarUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                          item.persona.name.charAt(0)
                      )}
                   </div>
                   <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      !item.price 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                        : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                   }`}>
                      {item.price ? `$${item.price}` : 'Free'}
                   </span>
                </div>

                {/* Info */}
                <div className="mb-3 relative z-10">
                   <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-primary transition-colors">{item.persona.name}</h3>
                   <p className="text-sm text-gray-400 font-medium">{item.persona.role}</p>
                </div>

                <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-2 relative z-10">
                   {item.persona.description}
                </p>

                {/* Metrics */}
                <div className="flex items-center space-x-4 mb-6 text-sm relative z-10">
                   <div className="flex items-center text-yellow-500">
                      <Star size={16} className="fill-current mr-1.5" />
                      <span className="font-semibold text-gray-200">{item.rating}</span>
                   </div>
                   <div className="flex items-center text-gray-500">
                      <Download size={16} className="mr-1.5" />
                      <span>{item.downloads.toLocaleString()}</span>
                   </div>
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-4 relative z-10">
                   <div className="flex gap-3">
                      <button 
                        className="flex-1 bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-brand-primary/20 transition-all text-sm z-20 relative"
                        onClick={(e) => {
                            e.stopPropagation();
                            alert(`Installing ${item.persona.name}...`);
                        }}
                      >
                         {item.price ? 'Get Persona' : 'Use Free'}
                      </button>
                      <button className="p-2.5 rounded-xl border border-brand-surfaceHighlight text-gray-400 hover:text-white hover:bg-brand-surfaceHighlight transition-colors">
                         <MessageSquare size={20} />
                      </button>
                   </div>
                   
                   {/* Author */}
                   <div className="text-xs text-gray-500 pt-1">
                      by <span className="text-gray-300 hover:text-white cursor-pointer transition-colors">{item.author || 'Unknown'}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;