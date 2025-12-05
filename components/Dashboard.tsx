import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ArrowUpRight, MessageSquare, Users, Database, Zap, Loader, Cpu, CheckCircle, Clock, PauseCircle, Activity } from 'lucide-react';
import { Persona } from '../types';
import { MOCK_PERSONAS } from '../services/mockData';

interface DashboardProps {
  personas?: Persona[];
  onNavigate?: (view: string) => void;
}

const data = [
  { name: 'Mon', interactions: 40 },
  { name: 'Tue', interactions: 30 },
  { name: 'Wed', interactions: 60 },
  { name: 'Thu', interactions: 90 },
  { name: 'Fri', interactions: 75 },
  { name: 'Sat', interactions: 100 },
  { name: 'Sun', interactions: 120 },
];

const StatCard = ({ title, value, icon: Icon, trend, colorClass = "text-white" }: any) => (
  <div className="bg-brand-surface border border-brand-surfaceHighlight rounded-xl p-6 relative overflow-hidden group hover:border-brand-primary/50 transition-all">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={64} />
    </div>
    <div className="flex items-center space-x-2 text-gray-400 mb-2">
      <Icon size={18} />
      <span className="text-sm font-medium">{title}</span>
    </div>
    <div className="flex items-end space-x-3">
      <span className={`text-3xl font-bold ${colorClass}`}>{value}</span>
      {trend && (
        <span className="text-xs text-brand-success flex items-center mb-1">
          <ArrowUpRight size={14} className="mr-1" />
          {trend}
        </span>
      )}
    </div>
  </div>
);

interface PersonaCardProps {
  persona: Persona;
  onNavigate?: (view: string) => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ persona, onNavigate }) => {
  const isTraining = persona.status === 'training';
  const isActive = persona.status === 'active';

  return (
    <div 
      className={`bg-brand-surface border rounded-xl p-5 transition-all group relative overflow-hidden ${
        isTraining ? 'border-brand-accent/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-brand-surfaceHighlight hover:border-brand-primary/50'
      }`}
    >
      {isTraining && (
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-surfaceHighlight">
          <div className="h-full bg-brand-accent w-[45%] animate-pulse-fast"></div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-surfaceHighlight group-hover:border-brand-primary/50 transition-colors bg-brand-dark">
               {persona.avatarUrl ? (
                 <img src={persona.avatarUrl} alt={persona.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-brand-primary/20 text-brand-primary">
                    <Users size={20} />
                 </div>
               )}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-brand-surface flex items-center justify-center ${
              isActive ? 'bg-brand-success' : 
              isTraining ? 'bg-brand-accent' : 'bg-gray-500'
            }`}>
              {isTraining && <Loader size={8} className="animate-spin text-white" />}
              {isActive && <CheckCircle size={8} className="text-white" />}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg group-hover:text-brand-primary transition-colors">{persona.name}</h3>
            <p className="text-xs text-gray-400">{persona.role}</p>
          </div>
        </div>
        
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          isActive ? 'bg-brand-success/10 text-brand-success border-brand-success/20' :
          isTraining ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20 animate-pulse' :
          'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }`}>
          {isTraining ? 'Training' : isActive ? 'Ready' : 'Paused'}
        </span>
      </div>

      {isTraining ? (
        <div className="mt-4 bg-brand-dark rounded-lg p-3 border border-brand-surfaceHighlight/50">
           <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono text-brand-accent flex items-center">
                <Cpu size={12} className="mr-1.5" />
                Fine-tuning model
              </span>
              <span className="text-xs font-mono text-white">45%</span>
           </div>
           <div className="w-full h-1.5 bg-brand-surfaceHighlight rounded-full overflow-hidden">
               <div className="h-full bg-brand-accent w-[45%] animate-[pulse_2s_ease-in-out_infinite]"></div>
           </div>
           <div className="flex justify-between mt-2 text-[10px] text-gray-500">
              <span>Epoch 3/10</span>
              <span>~12m remaining</span>
           </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-brand-surfaceHighlight/50">
           <div className="flex items-center space-x-4">
              <div className="flex items-center text-xs text-gray-400" title="Interactions">
                 <MessageSquare size={14} className="mr-1.5 text-brand-primary" />
                 <span>1.2k</span>
              </div>
              <div className="flex items-center text-xs text-gray-400" title="Latency">
                 <Zap size={14} className="mr-1.5 text-yellow-500" />
                 <span>98ms</span>
              </div>
           </div>
           <button 
             onClick={() => onNavigate && onNavigate('chat')}
             className="text-xs font-medium text-white hover:text-brand-primary transition-colors flex items-center"
           >
             Chat <ArrowUpRight size={12} className="ml-1" />
           </button>
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ personas = MOCK_PERSONAS, onNavigate }) => {
  const activePersonas = personas.filter(p => p.status === 'active');
  const trainingPersonas = personas.filter(p => p.status === 'training');

  return (
    <div className="p-8 space-y-8 animate-fade-in overflow-y-auto h-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400 mt-2">Overview of your digital persona fleet.</p>
        </div>
        <button 
          onClick={() => onNavigate && onNavigate('builder')}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-brand-primary/20"
        >
          + New Persona
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Personas" value={activePersonas.length} icon={Users} trend="+2 this week" />
        <StatCard title="Training Jobs" value={trainingPersonas.length} icon={Cpu} colorClass="text-brand-accent" />
        <StatCard title="Total Interactions" value="14.2k" icon={MessageSquare} trend="+12%" />
        <StatCard title="Avg Latency" value="124ms" icon={Zap} trend="-8%" />
      </div>

      {/* Persona Fleet Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-xl font-bold text-white flex items-center">
              <Activity size={20} className="mr-2 text-brand-primary" />
              Persona Fleet
           </h3>
           <button className="text-sm text-brand-primary hover:text-brand-accent transition-colors">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
           {personas.map(persona => (
             <PersonaCard key={persona.id} persona={persona} onNavigate={onNavigate} />
           ))}
           {/* Add Placeholder for New */}
           <button 
             onClick={() => onNavigate && onNavigate('builder')}
             className="border-2 border-dashed border-brand-surfaceHighlight rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary/50 hover:bg-brand-surface/50 transition-all group min-h-[180px]"
           >
              <div className="w-12 h-12 rounded-full bg-brand-surfaceHighlight flex items-center justify-center mb-3 group-hover:bg-brand-primary/20 transition-colors">
                 <Users size={24} />
              </div>
              <span className="font-medium">Deploy New Persona</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-brand-surface border border-brand-surfaceHighlight rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-semibold text-white">Interaction Volume</h3>
             <select className="bg-brand-dark border border-brand-surfaceHighlight text-xs text-gray-400 rounded-lg px-2 py-1 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
             </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' }}
                  itemStyle={{ color: '#6366F1' }}
                />
                <Area type="monotone" dataKey="interactions" stroke="#6366F1" fillOpacity={1} fill="url(#colorInteractions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-brand-surface border border-brand-surfaceHighlight rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">System Logs</h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {trainingPersonas.length > 0 && (
               <div className="flex items-start space-x-3 pb-4 border-b border-brand-surfaceHighlight/50">
                  <div className="w-2 h-2 mt-2 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
                  <div>
                    <p className="text-sm text-gray-200">
                      <span className="font-semibold text-white">Training Cluster</span> allocated GPUs for {trainingPersonas[0].name}
                    </p>
                    <span className="text-xs text-brand-accent font-mono mt-1 block">PID: 88291 • Just now</span>
                  </div>
               </div>
            )}
            
            {activePersonas.slice(0, 3).map((p, i) => (
              <div key={p.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-success" />
                <div>
                  <p className="text-sm text-gray-200">
                    <span className="font-semibold text-white">{p.name}</span> served 12 requests
                  </p>
                  <span className="text-xs text-gray-500">{i * 2 + 1} mins ago</span>
                </div>
              </div>
            ))}
            
            <div className="flex items-start space-x-3">
               <div className="w-2 h-2 mt-2 rounded-full bg-purple-500" />
               <div>
                  <p className="text-sm text-gray-200">
                     <span className="font-semibold text-white">Knowledge Base</span> indexed 4 new documents
                  </p>
                  <span className="text-xs text-gray-500">1 hour ago</span>
               </div>
            </div>
          </div>
          <button className="w-full mt-4 text-xs text-center text-gray-500 hover:text-white transition-colors">View Full Logs</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;