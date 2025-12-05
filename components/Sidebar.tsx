import React from 'react';
import { LayoutDashboard, Users, BookOpen, MessageSquare, ShoppingBag, Settings, PlusCircle } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'builder', icon: PlusCircle, label: 'Create Persona' },
    { id: 'notebook', icon: BookOpen, label: 'Notebook' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Marketplace' },
  ];

  return (
    <div className="w-64 h-screen bg-brand-dark border-r border-brand-surfaceHighlight flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
          PersonaOS
        </h1>
        <p className="text-xs text-gray-400 mt-1 tracking-wider">V1.0 PRODUCTION</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-brand-primary/20 text-brand-accent border border-brand-primary/30'
                : 'text-gray-400 hover:bg-brand-surface hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-brand-surfaceHighlight">
        <button 
            onClick={() => onNavigate('settings')}
            className={`flex items-center space-x-3 px-4 py-3 w-full transition-all rounded-xl ${
                currentView === 'settings' 
                ? 'text-white bg-brand-surfaceHighlight/50' 
                : 'text-gray-400 hover:text-white hover:bg-brand-surface'
            }`}
        >
          <Settings size={20} />
          <span className="text-sm">Settings</span>
        </button>
        <div className="mt-4 flex items-center space-x-3 px-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent shadow-lg shadow-brand-primary/20" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Alex User</span>
            <span className="text-xs text-gray-500">Pro Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;