import React, { useState, useRef } from 'react';
import { Check, Upload, User, Bot, Sparkles, Mic, FileText, ChevronRight, ChevronLeft, ChevronDown, Cpu, Zap, Activity, Layers, Terminal, Save, X, Trash2, Settings, Sliders, AlertCircle, StopCircle, Loader, Plus, CheckCircle, Download, MessageSquare, Globe, Youtube, Type, Link as LinkIcon, FileAudio } from 'lucide-react';
import { PersonaType, Persona } from '../types';

const steps = [
  { id: 1, title: 'Type' },
  { id: 2, title: 'Identity' },
  { id: 3, title: 'Personality' },
  { id: 4, title: 'Knowledge' },
  { id: 5, title: 'Review' },
  { id: 6, title: 'Training' },
];

interface PersonaBuilderProps {
  onPersonaCreated?: (persona: Persona) => void;
}

interface SourceItem {
  id: string;
  type: 'file' | 'url' | 'youtube' | 'text' | 'audio';
  title: string;
  content?: string;
  icon?: React.ElementType;
}

const PersonaBuilder: React.FC<PersonaBuilderProps> = ({ onPersonaCreated }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    type: '' as PersonaType | '',
    name: '',
    role: '',
    sliders: { formal: 50, direct: 50, serious: 50, analytical: 50, calm: 50 },
    sources: [] as SourceItem[]
  });

  const [errors, setErrors] = useState({
    type: '',
    name: '',
    role: ''
  });
  
  // Training Configuration State
  const [trainingConfig, setTrainingConfig] = useState({
    model: 'gemini-2.5-flash',
    epochs: 10,
    learningRate: 'adaptive'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Saved Configs State
  const [savedConfigs, setSavedConfigs] = useState([
    { id: 'preset-1', name: 'Rapid Tune (Dev)', config: { model: 'gemini-2.5-flash', epochs: 5, learningRate: 'adaptive' }, isSystem: true },
    { id: 'preset-2', name: 'Deep Context (Prod)', config: { model: 'gemini-3-pro', epochs: 30, learningRate: 'cosine' }, isSystem: true }
  ]);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [newConfigName, setNewConfigName] = useState('');

  // Training Simulation State
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingLog, setTrainingLog] = useState("Initializing training sequence...");

  const validateStep = (step: number) => {
    let isValid = true;
    const newErrors = { ...errors };

    if (step === 1) {
      if (!formData.type) {
        newErrors.type = 'Please select a persona type to continue.';
        isValid = false;
      } else {
        newErrors.type = '';
      }
    }

    if (step === 2) {
      if (!formData.name.trim()) {
        newErrors.name = 'Persona name is required.';
        isValid = false;
      } else {
        newErrors.name = '';
      }
      if (!formData.role.trim()) {
        newErrors.role = 'Role description is required.';
        isValid = false;
      } else {
        newErrors.role = '';
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSaveConfig = () => {
    if (newConfigName.trim()) {
        setSavedConfigs([...savedConfigs, {
            id: `custom-${Date.now()}`,
            name: newConfigName,
            config: { ...trainingConfig },
            isSystem: false
        }]);
        setNewConfigName('');
        setIsSavingConfig(false);
    }
  };

  const handleDeleteConfig = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedConfigs(prev => prev.filter(c => c.id !== id));
  };

  const handleStartTraining = () => {
    setIsTraining(true);
    let progress = 0;

    const interval = setInterval(() => {
      progress += 1;
      setTrainingProgress(progress);

      // Simulate training stages
      if (progress < 15) setTrainingLog("Tokenizing knowledge base vectors...");
      else if (progress < 30) setTrainingLog("Allocating GPU cluster resources...");
      else if (progress < 85) {
        setTrainingLog("Fine-tuning neural weights...");
      }
      else if (progress < 95) setTrainingLog("Verifying safety alignment...");
      else setTrainingLog("Finalizing persona deployment...");

      if (progress >= 100) {
        clearInterval(interval);
        
        const newPersona: Persona = {
          id: `p-${Date.now()}`,
          name: formData.name || 'Untitled Persona',
          role: formData.role || 'Digital Assistant',
          description: formData.role || 'Custom Persona',
          type: formData.type as PersonaType || PersonaType.EXPERT,
          status: 'training', // Remains 'training' in dashboard for visibility
          visibility: 'private',
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'AI')}&background=random`,
          config: {
            identity: { tone: 'Custom', objective: formData.role },
            personality: {
               formalCasual: formData.sliders.formal,
               directDiplomatic: formData.sliders.direct,
               seriousPlayful: formData.sliders.serious,
               analyticalEmotional: formData.sliders.analytical,
               calmExpressive: formData.sliders.calm
            }
          }
        };
    
        if (onPersonaCreated) {
          onPersonaCreated(newPersona);
        }
      }
    }, 80); // ~8 seconds total for better visualization
  };

  // --- Step Components ---

  const templates = [
    {
      id: 'tpl-1',
      name: 'Customer Support',
      role: 'Support Agent',
      icon: MessageSquare,
      desc: 'Empathetic and solution-oriented agent for handling tickets.',
      config: { type: PersonaType.EXPERT, sliders: { formal: 70, direct: 40, serious: 60, analytical: 50, calm: 90 } }
    },
    {
      id: 'tpl-2',
      name: 'Code Reviewer',
      role: 'Senior Engineer',
      icon: Terminal,
      desc: 'Strict, clean-code advocate for auditing pull requests.',
      config: { type: PersonaType.EXPERT, sliders: { formal: 40, direct: 90, serious: 80, analytical: 100, calm: 50 } }
    },
    {
      id: 'tpl-3',
      name: 'Creative Writer',
      role: 'Storyteller',
      icon: Sparkles,
      desc: 'Imaginative persona for brainstorming and narrative generation.',
      config: { type: PersonaType.CHARACTER, sliders: { formal: 10, direct: 20, serious: 10, analytical: 30, calm: 60 } }
    }
  ];

  const handleTemplateSelect = (tpl: any) => {
    setFormData(prev => ({
      ...prev,
      type: tpl.config.type,
      role: tpl.role,
      sliders: tpl.config.sliders
    }));
    setCurrentStep(1);
  };

  const StepLanding = () => (
    <div className="h-full flex flex-col items-center justify-center animate-fade-in p-8">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mb-12">
            <h1 className="text-4xl font-bold text-white tracking-tight">Persona Studio</h1>
            <p className="text-gray-400 text-lg">
                Design high-fidelity cognitive architectures. Start from a blank canvas, import a config, or accelerate with a template.
            </p>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Main Actions */}
            <div className="lg:col-span-5 space-y-4">
                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Core Actions</h3>
                 
                 <button 
                    onClick={() => setCurrentStep(1)}
                    className="w-full p-6 bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 border border-brand-primary/30 hover:border-brand-primary rounded-2xl text-left group transition-all relative overflow-hidden"
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-brand-primary rounded-lg text-white shadow-lg shadow-brand-primary/20">
                            <Plus size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">Create from Scratch</h3>
                            <p className="text-sm text-gray-400">Define every parameter manually.</p>
                        </div>
                    </div>
                </button>

                <button 
                    className="w-full p-6 bg-brand-surface border border-brand-surfaceHighlight hover:border-brand-accent rounded-2xl text-left group transition-all relative overflow-hidden"
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-brand-surfaceHighlight rounded-lg text-gray-300 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                            <Upload size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors">Import Configuration</h3>
                            <p className="text-sm text-gray-400">Upload .json or .yaml definition.</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Divider (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
                <div className="h-full w-px bg-brand-surfaceHighlight relative">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-dark px-2 text-xs text-gray-500 font-medium">OR</span>
                </div>
            </div>

            {/* Right: Templates */}
            <div className="lg:col-span-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Start Templates</h3>
                <div className="grid grid-cols-1 gap-4">
                    {templates.map(tpl => (
                        <button
                            key={tpl.id}
                            onClick={() => handleTemplateSelect(tpl)}
                            className="flex items-center p-4 bg-brand-surface border border-brand-surfaceHighlight rounded-xl hover:bg-brand-surfaceHighlight/50 hover:border-gray-500 transition-all group text-left"
                        >
                            <div className="p-3 rounded-lg bg-brand-dark border border-brand-surfaceHighlight text-gray-400 group-hover:text-white group-hover:border-gray-500 transition-colors">
                                <tpl.icon size={20} />
                            </div>
                            <div className="ml-4">
                                <h4 className="text-white font-medium group-hover:text-brand-primary transition-colors">{tpl.name}</h4>
                                <p className="text-xs text-gray-500">{tpl.desc}</p>
                            </div>
                            <ChevronRight size={16} className="ml-auto text-gray-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Footer Stats */}
         <div className="mt-16 grid grid-cols-3 gap-12 text-center opacity-50">
            <div>
                <div className="text-2xl font-bold text-white">100+</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Base Models</div>
            </div>
            <div>
                <div className="text-2xl font-bold text-white">128k</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Context Window</div>
            </div>
             <div>
                <div className="text-2xl font-bold text-white">0.05s</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Inference Time</div>
            </div>
         </div>
    </div>
  );

  const StepType = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { id: PersonaType.DIGITAL_YOU, icon: User, desc: 'Clone yourself using your content.' },
            { id: PersonaType.EXPERT, icon: Bot, desc: 'Create a domain expert agent.' },
            { id: PersonaType.CHARACTER, icon: Sparkles, desc: 'Fictional character for storytelling.' },
        ].map((type) => (
            <button
            key={type.id}
            onClick={() => {
                setFormData({ ...formData, type: type.id });
                if (errors.type) setErrors(prev => ({ ...prev, type: '' }));
            }}
            className={`p-8 rounded-2xl border text-left transition-all duration-200 group relative overflow-hidden ${
                formData.type === type.id
                ? 'border-brand-accent bg-brand-accent/10 ring-1 ring-brand-accent'
                : 'border-brand-surfaceHighlight bg-brand-surface hover:border-brand-primary'
            }`}
            >
            <type.icon size={48} className={`mb-4 ${formData.type === type.id ? 'text-brand-accent' : 'text-gray-400 group-hover:text-brand-primary'}`} />
            <h3 className="text-xl font-bold text-white mb-2">{type.id}</h3>
            <p className="text-gray-400 text-sm">{type.desc}</p>
            </button>
        ))}
        </div>
        {errors.type && (
            <div className="flex items-center text-red-400 text-sm animate-fade-in bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle size={16} className="mr-2" />
                {errors.type}
            </div>
        )}
    </div>
  );

  const StepIdentity = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Persona Name <span className="text-red-400">*</span></label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
          }}
          className={`w-full bg-brand-dark border rounded-lg p-4 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all ${
              errors.name ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-brand-surfaceHighlight'
          }`}
          placeholder="e.g. Sarah Chen"
        />
        {errors.name && <p className="text-red-400 text-xs mt-1 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Role / Description <span className="text-red-400">*</span></label>
        <textarea
          value={formData.role}
          onChange={(e) => {
              setFormData({ ...formData, role: e.target.value });
              if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
          }}
          className={`w-full bg-brand-dark border rounded-lg p-4 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none h-32 transition-all ${
              errors.role ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-brand-surfaceHighlight'
          }`}
          placeholder="e.g. Senior Product Manager expert in SaaS metrics..."
        />
        {errors.role && <p className="text-red-400 text-xs mt-1 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.role}</p>}
      </div>
    </div>
  );

  const StepPersonality = () => (
    <div className="max-w-2xl mx-auto space-y-8 bg-brand-surface p-8 rounded-2xl border border-brand-surfaceHighlight">
      {[
        { key: 'formal', left: 'Casual', right: 'Formal' },
        { key: 'direct', left: 'Diplomatic', right: 'Direct' },
        { key: 'serious', left: 'Playful', right: 'Serious' },
        { key: 'analytical', left: 'Emotional', right: 'Analytical' },
        { key: 'calm', left: 'Expressive', right: 'Calm' },
      ].map((slider) => (
        <div key={slider.key}>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{slider.left}</span>
            <span>{slider.right}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            // @ts-ignore
            value={formData.sliders[slider.key]}
            // @ts-ignore
            onChange={(e) => setFormData({...formData, sliders: {...formData.sliders, [slider.key]: parseInt(e.target.value)}})}
            className="w-full h-2 bg-brand-dark rounded-lg appearance-none cursor-pointer accent-brand-accent"
          />
        </div>
      ))}
    </div>
  );

  const StepKnowledge = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [activeInput, setActiveInput] = useState<'none' | 'url' | 'youtube' | 'text'>('none');
    const [inputText, setInputText] = useState('');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newSource: SourceItem = {
                id: `s-${Date.now()}`,
                type: 'file',
                title: file.name,
                icon: FileText
            };
            setFormData(prev => ({ ...prev, sources: [newSource, ...prev.sources] }));
        }
    };

    const handleAddInput = () => {
        if (!inputText.trim()) return;
        
        let type: SourceItem['type'] = 'text';
        let icon = Type;
        let title = 'Text Note';

        if (activeInput === 'url') {
            type = 'url';
            icon = Globe;
            title = new URL(inputText).hostname;
        } else if (activeInput === 'youtube') {
            type = 'youtube';
            icon = Youtube;
            title = 'YouTube Video';
        } else {
            title = inputText.slice(0, 20) + '...';
        }

        const newSource: SourceItem = {
            id: `s-${Date.now()}`,
            type,
            title,
            content: inputText,
            icon
        };
        
        setFormData(prev => ({ ...prev, sources: [newSource, ...prev.sources] }));
        setInputText('');
        setActiveInput('none');
    };

    const handleRecordToggle = () => {
        if (isRecording) {
            setIsRecording(false);
            const newSource: SourceItem = {
                id: `s-${Date.now()}`,
                type: 'audio',
                title: `Voice Memo ${new Date().toLocaleTimeString()}`,
                icon: FileAudio
            };
            setFormData(prev => ({ ...prev, sources: [newSource, ...prev.sources] }));
        } else {
            setIsRecording(true);
        }
    };

    const removeSource = (id: string) => {
        setFormData(prev => ({
            ...prev,
            sources: prev.sources.filter(s => s.id !== id)
        }));
    };

    const SourceOption = ({ label, icon: Icon, onClick, active }: any) => (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-200 group ${
                active 
                ? 'bg-brand-primary/10 border-brand-primary text-white ring-1 ring-brand-primary' 
                : 'bg-brand-surface border-brand-surfaceHighlight text-gray-400 hover:bg-brand-surfaceHighlight/50 hover:border-gray-500 hover:text-white'
            }`}
        >
            <div className={`p-3 rounded-full ${active ? 'bg-brand-primary text-white' : 'bg-brand-dark text-gray-500 group-hover:text-white'}`}>
                <Icon size={24} />
            </div>
            <span className="text-sm font-medium">{label}</span>
        </button>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">Knowledge Base</h3>
                <p className="text-gray-400">Connect diverse data sources to ground your persona.</p>
            </div>

            {/* Source Type Selector */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <SourceOption 
                    label="Upload" 
                    icon={Upload} 
                    onClick={() => fileInputRef.current?.click()} 
                />
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                
                <SourceOption 
                    label="Website" 
                    icon={Globe} 
                    active={activeInput === 'url'}
                    onClick={() => setActiveInput(activeInput === 'url' ? 'none' : 'url')} 
                />
                <SourceOption 
                    label="YouTube" 
                    icon={Youtube} 
                    active={activeInput === 'youtube'}
                    onClick={() => setActiveInput(activeInput === 'youtube' ? 'none' : 'youtube')} 
                />
                <SourceOption 
                    label="Text" 
                    icon={Type} 
                    active={activeInput === 'text'}
                    onClick={() => setActiveInput(activeInput === 'text' ? 'none' : 'text')} 
                />
                <SourceOption 
                    label={isRecording ? "Stop" : "Record"} 
                    icon={isRecording ? StopCircle : Mic} 
                    active={isRecording}
                    onClick={handleRecordToggle} 
                />
            </div>

            {/* Dynamic Input Area */}
            {activeInput !== 'none' && (
                <div className="bg-brand-surface border border-brand-surfaceHighlight rounded-2xl p-6 animate-fade-in relative">
                    <button 
                        onClick={() => setActiveInput('none')}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                    
                    <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                        {activeInput === 'url' && <><Globe size={18} className="text-blue-400" /> Add Website Source</>}
                        {activeInput === 'youtube' && <><Youtube size={18} className="text-red-500" /> Add YouTube Video</>}
                        {activeInput === 'text' && <><Type size={18} className="text-gray-400" /> Paste Text Content</>}
                    </h4>

                    <div className="flex flex-col gap-4">
                        {activeInput === 'text' ? (
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Paste relevant text, instructions, or raw data here..."
                                className="w-full bg-brand-dark border border-brand-surfaceHighlight rounded-xl p-4 text-white focus:ring-1 focus:ring-brand-primary outline-none h-32 resize-none"
                            />
                        ) : (
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={activeInput === 'youtube' ? "https://youtube.com/watch?v=..." : "https://example.com/docs"}
                                className="w-full bg-brand-dark border border-brand-surfaceHighlight rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-brand-primary outline-none"
                            />
                        )}
                        <div className="flex justify-end">
                            <button 
                                onClick={handleAddInput}
                                disabled={!inputText.trim()}
                                className="px-6 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                Add Source
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Source List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500 uppercase tracking-wider font-bold">
                    <span>Sources ({formData.sources.length})</span>
                    <span>128k Context Available</span>
                </div>
                
                {formData.sources.length === 0 ? (
                    <div className="border-2 border-dashed border-brand-surfaceHighlight rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-brand-surfaceHighlight/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Layers size={24} className="text-gray-500" />
                        </div>
                        <p className="text-gray-400">No sources added yet. Select a method above to begin.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.sources.map((source) => {
                            const Icon = source.icon || FileText;
                            return (
                                <div key={source.id} className="bg-brand-surface border border-brand-surfaceHighlight p-4 rounded-xl flex items-start justify-between group hover:border-brand-primary/50 transition-all">
                                    <div className="flex items-start gap-3 overflow-hidden">
                                        <div className={`p-2.5 rounded-lg shrink-0 ${
                                            source.type === 'youtube' ? 'bg-red-500/10 text-red-500' :
                                            source.type === 'url' ? 'bg-blue-500/10 text-blue-500' :
                                            source.type === 'audio' ? 'bg-purple-500/10 text-purple-500' :
                                            'bg-brand-primary/10 text-brand-primary'
                                        }`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <h5 className="text-white font-medium truncate pr-2">{source.title}</h5>
                                            <p className="text-xs text-gray-500 capitalize">{source.type} Source</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeSource(source.id)}
                                        className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
  };

  const StepReview = () => (
    <div className="max-w-md mx-auto bg-brand-surface border border-brand-surfaceHighlight rounded-2xl overflow-hidden shadow-2xl">
      <div className="h-32 bg-gradient-to-r from-brand-primary to-brand-accent p-6 flex items-end">
        <h2 className="text-2xl font-bold text-white">{formData.name || 'Untitled Persona'}</h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-surfaceHighlight pb-4">
          <span className="text-gray-400">Type</span>
          <span className="text-white font-medium">{formData.type}</span>
        </div>
        <div className="flex items-center justify-between border-b border-brand-surfaceHighlight pb-4">
          <span className="text-gray-400">Role</span>
          <span className="text-white font-medium truncate max-w-[200px]">{formData.role}</span>
        </div>
        <div className="py-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Personality Profile</h4>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(formData.sliders).map(([k, v]) => (
              <span key={k} className="px-2 py-1 bg-brand-dark rounded text-xs text-brand-accent border border-brand-accent/20">
                {k}: {v}%
              </span>
            ))}
          </div>
        </div>
        
        <div className="py-2">
           <h4 className="text-sm font-semibold text-gray-300 mb-2">Knowledge Base ({formData.sources.length})</h4>
           <div className="space-y-1">
               {formData.sources.slice(0, 3).map((s, i) => (
                   <div key={i} className="text-xs text-gray-400 truncate flex items-center">
                       <FileText size={10} className="mr-1.5" /> {s.title}
                   </div>
               ))}
               {formData.sources.length > 3 && <span className="text-xs text-gray-500 italic">...and {formData.sources.length - 3} more</span>}
           </div>
        </div>

        <button 
          onClick={handleNext}
          className="w-full bg-brand-surfaceHighlight hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-brand-primary/50 transition-colors flex items-center justify-center space-x-2 mt-4"
        >
          <span>Configure Training</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const StepTraining = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-brand-surface border border-brand-surfaceHighlight rounded-2xl p-8 min-h-[500px] flex flex-col justify-center transition-all">
        {!isTraining ? (
          // Configuration View
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Training Configuration</h3>
                <p className="text-gray-400">Define the cognitive architecture and fine-tuning parameters.</p>
              </div>
              
              <button 
                onClick={() => setIsSavingConfig(!isSavingConfig)}
                className="flex items-center space-x-2 text-xs font-medium text-brand-primary hover:text-brand-accent transition-colors bg-brand-primary/10 px-3 py-2 rounded-lg"
              >
                <Save size={14} />
                <span>Save Preset</span>
              </button>
            </div>

            {/* Presets Manager */}
            <div className="bg-brand-dark/50 p-4 rounded-xl border border-brand-surfaceHighlight/50">
                <div className="flex items-center gap-2 mb-2">
                    <Settings size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Load Configuration Preset</span>
                </div>
                
                {isSavingConfig && (
                    <div className="flex items-center gap-2 mb-4 animate-fade-in">
                        <input 
                            type="text" 
                            value={newConfigName}
                            onChange={(e) => setNewConfigName(e.target.value)}
                            placeholder="Preset Name (e.g. High Precision)..."
                            className="flex-1 bg-brand-dark border border-brand-surfaceHighlight rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
                            autoFocus
                        />
                        <button 
                            onClick={handleSaveConfig}
                            disabled={!newConfigName.trim()}
                            className="bg-brand-primary text-white text-xs px-4 py-2.5 rounded-lg hover:bg-brand-primary/90 disabled:opacity-50"
                        >
                            Save
                        </button>
                        <button onClick={() => setIsSavingConfig(false)} className="p-2 text-gray-500 hover:text-white">
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {savedConfigs.map(preset => (
                        <button
                            key={preset.id}
                            onClick={() => setTrainingConfig({ ...preset.config })}
                            className={`group relative px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
                                JSON.stringify(trainingConfig) === JSON.stringify(preset.config)
                                ? 'bg-brand-primary/20 border-brand-primary text-white'
                                : 'bg-brand-surface border-brand-surfaceHighlight text-gray-400 hover:text-white hover:border-gray-500'
                            }`}
                        >
                            {preset.name}
                            {!preset.isSystem && (
                                <span 
                                    onClick={(e) => handleDeleteConfig(preset.id, e)}
                                    className="ml-1 p-0.5 rounded-full hover:bg-red-500/20 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={10} />
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Model Selection - Compact Grid */}
            <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setTrainingConfig({...trainingConfig, model: 'gemini-2.5-flash'})}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${trainingConfig.model === 'gemini-2.5-flash' ? 'bg-brand-primary/20 border-brand-primary' : 'bg-brand-dark border-brand-surfaceHighlight opacity-60'}`}
                  >
                    <div className="p-2 rounded-lg bg-brand-surfaceHighlight/50 text-brand-accent">
                        <Zap size={20} />
                    </div>
                    <div>
                        <span className="block font-bold text-white text-sm">Gemini 2.5 Flash</span>
                        <span className="text-xs text-gray-400">Low Latency</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setTrainingConfig({...trainingConfig, model: 'gemini-3-pro'})}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${trainingConfig.model === 'gemini-3-pro' ? 'bg-brand-primary/20 border-brand-primary' : 'bg-brand-dark border-brand-surfaceHighlight opacity-60'}`}
                  >
                     <div className="p-2 rounded-lg bg-brand-surfaceHighlight/50 text-purple-400">
                        <Cpu size={20} />
                    </div>
                    <div>
                        <span className="block font-bold text-white text-sm">Gemini 3 Pro</span>
                        <span className="text-xs text-gray-400">High Reasoning</span>
                    </div>
                  </button>
            </div>

            {/* Collapsible Advanced Settings */}
            <div className="border border-brand-surfaceHighlight rounded-xl overflow-hidden">
                <button 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between p-4 bg-brand-surface/30 hover:bg-brand-surface/50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                     <Sliders size={18} className="text-brand-primary" />
                     <span className="text-sm font-semibold text-white">Advanced Settings</span>
                  </div>
                  {showAdvanced ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                </button>
                
                {showAdvanced && (
                  <div className="p-4 bg-brand-dark/30 border-t border-brand-surfaceHighlight space-y-6 animate-fade-in">
                      {/* Epochs */}
                      <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-gray-300">Training Epochs</label>
                            <span className="text-brand-accent font-mono">{trainingConfig.epochs}</span>
                          </div>
                          <input 
                            type="range" min="1" max="50" step="1" 
                            value={trainingConfig.epochs}
                            onChange={(e) => setTrainingConfig({...trainingConfig, epochs: parseInt(e.target.value)})}
                            className="w-full h-2 bg-brand-dark rounded-lg appearance-none cursor-pointer accent-brand-accent"
                          />
                          <p className="text-xs text-gray-500 mt-2">Higher epochs improve pattern adherence but increase risk of overfitting.</p>
                      </div>

                      {/* Learning Rate */}
                      <div>
                          <div className="flex justify-between mb-3">
                            <label className="text-sm font-medium text-gray-300">Learning Rate Strategy</label>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            {['adaptive', 'constant', 'cosine'].map(rate => (
                                <button
                                    key={rate}
                                    onClick={() => setTrainingConfig({...trainingConfig, learningRate: rate})}
                                    className={`px-3 py-2.5 rounded-lg text-xs font-bold border transition-all capitalize ${
                                        trainingConfig.learningRate === rate 
                                        ? 'bg-brand-primary/20 border-brand-primary text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                                        : 'bg-brand-dark border-brand-surfaceHighlight text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {rate}
                                </button>
                            ))}
                          </div>
                      </div>
                  </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-brand-surfaceHighlight">
              <div className="text-center">
                  <span className="block text-xl font-bold text-white">~{trainingConfig.epochs * 2}m</span>
                  <span className="text-xs text-gray-500">Est. Time</span>
              </div>
              <div className="text-center">
                  <span className="block text-xl font-bold text-white">High</span>
                  <span className="text-xs text-gray-500">Compute</span>
              </div>
              <div className="text-center">
                  <span className="block text-xl font-bold text-white">${(trainingConfig.epochs * 0.05).toFixed(2)}</span>
                  <span className="text-xs text-gray-500">Est. Cost</span>
              </div>
            </div>

            <button 
              onClick={handleStartTraining}
              className="w-full bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center space-x-3"
            >
              <Activity size={20} className="animate-pulse" />
              <span>Start Training Pipeline</span>
            </button>
          </div>
        ) : (
          // Simulation Progress View
          <div className="space-y-8 text-center animate-fade-in px-4">
            
            {/* Main Progress Circle */}
            <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-brand-surfaceHighlight"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={439.82}
                  strokeDashoffset={439.82 - (trainingProgress / 100) * 439.82}
                  className="text-brand-primary transition-all duration-300 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-bold text-white">{trainingProgress}%</span>
                 <span className="text-xs text-gray-400 uppercase tracking-wider mt-1">Complete</span>
              </div>
            </div>
            
            {/* Dynamic Status Text */}
            <div className="space-y-2 h-16">
               <h3 className="text-xl font-bold text-white animate-pulse">{trainingLog.split('...')[0]}...</h3>
               <p className="text-gray-400 text-sm">Fine-tuning {formData.name} model architecture</p>
            </div>

            {/* Enhanced Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-brand-dark/30 p-6 rounded-xl border border-brand-surfaceHighlight shadow-inner">
               {/* Epochs */}
               <div className="flex flex-col items-center justify-center p-4 bg-brand-surface/50 rounded-xl border border-brand-surfaceHighlight/50 backdrop-blur-sm">
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2">Epoch</div>
                  <div className="text-white font-mono font-bold text-2xl">
                     {Math.max(1, Math.min(Math.ceil(((trainingProgress - 10) / 90) * trainingConfig.epochs), trainingConfig.epochs))}/{trainingConfig.epochs}
                  </div>
                  <div className="w-12 h-1 bg-brand-surfaceHighlight mt-2 rounded-full overflow-hidden">
                     <div className="h-full bg-white/50 animate-pulse" style={{ width: `${(trainingProgress % 20) * 5}%` }}></div>
                  </div>
               </div>
               
               {/* Loss */}
               <div className="flex flex-col items-center justify-center p-4 bg-brand-surface/50 rounded-xl border border-brand-surfaceHighlight/50 backdrop-blur-sm">
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2">Loss</div>
                  <div className="text-brand-accent font-mono font-bold text-2xl">
                    {(Math.max(0.0042, 0.8 * Math.exp(-trainingProgress / 20))).toFixed(4)}
                  </div>
                  <span className="text-[10px] text-brand-accent/70 mt-1 flex items-center">
                    <Activity size={10} className="mr-1" /> Optimizing
                  </span>
               </div>

               {/* Accuracy */}
               <div className="flex flex-col items-center justify-center p-4 bg-brand-surface/50 rounded-xl border border-brand-surfaceHighlight/50 backdrop-blur-sm">
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2">Accuracy</div>
                  <div className="text-green-400 font-mono font-bold text-2xl">
                    {Math.min(99.8, 35 + (trainingProgress * 0.65)).toFixed(1)}%
                  </div>
                   <span className="text-[10px] text-green-500/70 mt-1">Validation</span>
               </div>

               {/* Throughput */}
               <div className="flex flex-col items-center justify-center p-4 bg-brand-surface/50 rounded-xl border border-brand-surfaceHighlight/50 backdrop-blur-sm">
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2">Speed</div>
                  <div className="text-purple-400 font-mono font-bold text-2xl">
                    {(trainingProgress > 5 ? 4200 + Math.random() * 300 : 0).toFixed(0)}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">tok/sec</span>
               </div>
            </div>

            {/* Terminal / Log Output */}
             <div className="bg-black/80 rounded-xl p-4 text-left font-mono text-xs text-green-400 h-40 overflow-hidden flex flex-col justify-end border border-brand-surfaceHighlight/50 relative shadow-2xl">
                <div className="opacity-30">system: initializing_tensors...</div>
                <div className="opacity-40">gpu_0: allocating_memory_blocks...</div>
                <div className="opacity-50">data_loader: batch_size=32 verified</div>
                {trainingProgress > 10 && <div className="opacity-60">model: loading_weights_checkpoint_v2.5</div>}
                {trainingProgress > 20 && <div className="opacity-70">optimizer: adam_w initialized (lr=3e-4)</div>}
                {trainingProgress > 40 && <div className="opacity-80">training: batch_142 loss=0.342 acc=68%</div>}
                {trainingProgress > 60 && <div className="opacity-90">training: batch_289 loss=0.104 acc=89%</div>}
                <div className="mt-1 flex items-center border-t border-green-900/50 pt-2">
                  <span className="mr-2 text-green-600">&gt;</span>
                  <span className="animate-pulse">{trainingLog.toLowerCase().replace(/ /g, '_')}</span>
                </div>
                <div className="absolute top-3 right-3 text-gray-700">
                    <Terminal size={16} />
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8 h-full flex flex-col">
      {currentStep > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">Create New Persona</h2>
            <div className="flex items-center mt-6 space-x-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                      currentStep >= step.id
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-brand-surfaceHighlight text-gray-500'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span className={`ml-2 text-sm ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                  {step.id !== steps.length && (
                    <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? 'bg-brand-primary' : 'bg-brand-surfaceHighlight'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {currentStep === 0 && <StepLanding />}
        {currentStep === 1 && <StepType />}
        {currentStep === 2 && <StepIdentity />}
        {currentStep === 3 && <StepPersonality />}
        {currentStep === 4 && <StepKnowledge />}
        {currentStep === 5 && <StepReview />}
        {currentStep === 6 && <StepTraining />}
      </div>

      {currentStep > 0 && (
          <div className="mt-8 flex justify-between border-t border-brand-surfaceHighlight pt-6">
            {!isTraining && (
                 <button
                 onClick={handleBack}
                 className="flex items-center px-6 py-3 rounded-xl text-sm font-medium bg-brand-surface hover:bg-brand-surfaceHighlight text-white"
               >
                 <ChevronLeft size={16} className="mr-2" /> Back
               </button>
            )}
            
            {currentStep < 5 && (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-medium shadow-lg shadow-brand-primary/25 ml-auto"
              >
                Next <ChevronRight size={16} className="ml-2" />
              </button>
            )}
            {/* Step 5 and 6 handle their own next actions */}
          </div>
      )}
    </div>
  );
};

export default PersonaBuilder;