import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PersonaBuilder from './components/PersonaBuilder';
import Notebook from './components/Notebook';
import ChatInterface from './components/ChatInterface';
import Marketplace from './components/Marketplace';
import Settings from './components/Settings';
import { MOCK_PERSONAS } from './services/mockData';
import { Persona } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [personas, setPersonas] = useState<Persona[]>(MOCK_PERSONAS);

  const handlePersonaCreated = (newPersona: Persona) => {
    setPersonas(prev => [newPersona, ...prev]);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard personas={personas} onNavigate={setCurrentView} />;
      case 'builder':
        return <PersonaBuilder onPersonaCreated={handlePersonaCreated} />;
      case 'notebook':
        return <Notebook />;
      case 'chat':
        return <ChatInterface personas={personas} />;
      case 'marketplace':
        return <Marketplace />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard personas={personas} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-dark text-white font-sans selection:bg-brand-primary/30">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 ml-64 h-screen overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-brand-primary/10 blur-[128px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-accent/5 blur-[100px]" />
        </div>
        
        <div className="relative z-10 h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;