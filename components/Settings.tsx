import React, { useState, useRef } from 'react';
import { User, Key, Bell, Shield, Palette, CreditCard, HelpCircle, Save, CheckCircle, Upload, Trash2, Moon, Sun, Monitor, Smartphone, Mail, Lock, AlertCircle, ChevronDown, ChevronUp, Download, ExternalLink } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    bio: 'Product Strategist | AI Enthusiast',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [toggles, setToggles] = useState({
    emailDigest: true,
    pushAlerts: false,
    desktopNotifs: true,
    twoFactor: false,
    compactMode: false,
    dataSharing: false
  });

  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  // Helpers
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => {
        const newState = { ...prev, [key]: !prev[key] };
        showToast(`${String(key)} ${newState[key] ? 'enabled' : 'disabled'}`);
        return newState;
    });
  };

  // Handlers
  const handleSaveProfile = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        showToast("Profile updated successfully");
    }, 800);
  };

  const handleSaveSecurity = () => {
      if (formData.newPassword !== formData.confirmPassword) {
          showToast("Passwords do not match", "error");
          return;
      }
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
          showToast("Security settings updated");
      }, 800);
  };

  const handleAvatarClick = () => fileInputRef.current?.click();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
          showToast(`Uploading ${e.target.files[0].name}...`);
          setTimeout(() => showToast("Avatar updated successfully"), 1500);
      }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  // --- Sub-Components ---
  
  const ProfileView = () => (
    <div className="max-w-3xl animate-fade-in space-y-8">
       <div>
           <h3 className="text-xl font-bold text-white mb-2">Profile Details</h3>
           <p className="text-gray-400 text-sm">Manage your public information and avatar.</p>
       </div>

       {/* Avatar */}
       <div className="flex items-center space-x-6 bg-brand-dark/50 p-6 rounded-xl border border-brand-surfaceHighlight/50">
          <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-4xl font-bold text-white shadow-lg overflow-hidden">
                 {/* Placeholder or Image */}
                 <span className="group-hover:opacity-50 transition-opacity">{formData.fullName.charAt(0)}</span>
              </div>
              <div onClick={handleAvatarClick} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/40 rounded-2xl">
                 <Upload size={24} className="text-white" />
              </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-1">Your Avatar</h4>
            <p className="text-xs text-gray-400 mb-4">Recommended size: 400x400px. Max 2MB.</p>
            <div className="flex gap-3">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <button 
                    onClick={handleAvatarClick}
                    className="px-4 py-2 bg-brand-surfaceHighlight border border-brand-surfaceHighlight hover:bg-brand-surfaceHighlight/80 hover:border-brand-primary/50 rounded-lg text-xs font-medium text-white transition-all"
                >
                Upload New
                </button>
                <button 
                    onClick={() => showToast("Avatar removed", "success")}
                    className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-red-400 transition-colors flex items-center"
                >
                    <Trash2 size={14} className="mr-1" /> Remove
                </button>
            </div>
          </div>
       </div>

       {/* Form */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
             <input
               type="text"
               value={formData.fullName}
               onChange={(e) => setFormData({...formData, fullName: e.target.value})}
               className="w-full bg-brand-dark border border-brand-surfaceHighlight rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all placeholder-gray-600"
             />
           </div>
           <div>
             <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
             <input
               type="email"
               value={formData.email}
               onChange={(e) => setFormData({...formData, email: e.target.value})}
               className="w-full bg-brand-dark border border-brand-surfaceHighlight rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all placeholder-gray-600"
             />
           </div>
           <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bio</label>
            <textarea
               rows={3}
               value={formData.bio}
               onChange={(e) => setFormData({...formData, bio: e.target.value})}
               className="w-full bg-brand-dark border border-brand-surfaceHighlight rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all resize-none placeholder-gray-600"
            />
           </div>
       </div>

       <div className="pt-6 border-t border-brand-surfaceHighlight flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-medium rounded-lg shadow-lg shadow-brand-primary/20 hover:opacity-90 transition-all flex items-center space-x-2"
            >
              {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
              ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
              )}
            </button>
       </div>
    </div>
  );

  const ApiView = () => (
      <div className="max-w-3xl animate-fade-in space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">API Configuration</h3>
            <p className="text-gray-400 text-sm">Manage connection to the Gemini AI models.</p>
          </div>

          <div className="bg-brand-surfaceHighlight/20 border border-brand-primary/30 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 blur-2xl rounded-full" />
              <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center space-x-4">
                      <div className="p-3 bg-brand-primary/20 rounded-lg text-brand-primary">
                          <Key size={24} />
                      </div>
                      <div>
                          <h4 className="text-white font-bold text-lg">Gemini API Key</h4>
                          <p className="text-sm text-gray-400 mt-1">Configured via environment variables</p>
                      </div>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold rounded-full flex items-center">
                      <CheckCircle size={12} className="mr-1.5" />
                      Active
                  </span>
              </div>
              <div className="mt-6 bg-brand-dark rounded-lg p-4 font-mono text-xs text-gray-500 border border-brand-surfaceHighlight flex items-center justify-between">
                  <span>****************************a1b2</span>
                  <span className="text-gray-600 italic">Managed by System</span>
              </div>
          </div>

          <div className="bg-brand-dark border border-brand-surfaceHighlight rounded-xl p-6">
              <h4 className="text-white font-semibold mb-4">Usage Limits</h4>
              <div className="space-y-4">
                  <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Requests per minute</span>
                          <span className="text-white">45 / 60</span>
                      </div>
                      <div className="w-full h-2 bg-brand-surfaceHighlight rounded-full overflow-hidden">
                          <div className="h-full bg-brand-primary w-[75%]" />
                      </div>
                  </div>
                  <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Token usage (Monthly)</span>
                          <span className="text-white">124k / 1M</span>
                      </div>
                      <div className="w-full h-2 bg-brand-surfaceHighlight rounded-full overflow-hidden">
                          <div className="h-full bg-brand-accent w-[12%]" />
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const NotificationsView = () => (
      <div className="max-w-2xl animate-fade-in space-y-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Notifications</h3>
            <p className="text-gray-400 text-sm">Choose how you want to be kept up to date.</p>
          </div>

          <div className="space-y-4">
              {[
                  { key: 'emailDigest', label: 'Email Digest', desc: 'Weekly summary of persona interactions and performance.', icon: Mail },
                  { key: 'pushAlerts', label: 'Push Alerts', desc: 'Instant notifications when training completes.', icon: Smartphone },
                  { key: 'desktopNotifs', label: 'Desktop Notifications', desc: 'Browser alerts for real-time chat messages.', icon: Monitor }
              ].map((item) => (
                  <div key={item.key} className="flex items-start justify-between p-4 bg-brand-dark border border-brand-surfaceHighlight rounded-xl">
                      <div className="flex gap-4">
                          <div className="p-2 bg-brand-surfaceHighlight/50 rounded-lg text-gray-300 h-fit">
                              <item.icon size={20} />
                          </div>
                          <div>
                              <h4 className="text-white font-medium text-sm">{item.label}</h4>
                              <p className="text-gray-500 text-xs mt-1 max-w-xs">{item.desc}</p>
                          </div>
                      </div>
                      <button 
                        // @ts-ignore
                        onClick={() => handleToggle(item.key)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                            // @ts-ignore
                            toggles[item.key] ? 'bg-brand-primary' : 'bg-gray-700'
                        }`}
                      >
                          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                              // @ts-ignore
                              toggles[item.key] ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                      </button>
                  </div>
              ))}
          </div>
      </div>
  );

  const SecurityView = () => (
      <div className="max-w-3xl animate-fade-in space-y-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Security & Login</h3>
            <p className="text-gray-400 text-sm">Protect your account and persona data.</p>
          </div>

          <div className="flex items-center justify-between p-6 bg-brand-surfaceHighlight/10 border border-brand-primary/20 rounded-xl">
              <div className="flex gap-4">
                  <div className="p-3 bg-brand-primary/20 text-brand-primary rounded-xl h-fit">
                      <Shield size={24} />
                  </div>
                  <div>
                      <h4 className="text-white font-bold">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-400 mt-1">Secure your account with 2FA.</p>
                  </div>
              </div>
              <button 
                onClick={() => handleToggle('twoFactor')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    toggles.twoFactor 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                    : 'bg-brand-primary text-white hover:bg-brand-primary/90'
                }`}
              >
                  {toggles.twoFactor ? 'Disable' : 'Enable 2FA'}
              </button>
          </div>

          <div className="space-y-4 pt-4 border-t border-brand-surfaceHighlight">
              <h4 className="text-white font-semibold flex items-center gap-2">
                  <Lock size={16} /> Change Password
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                    className="bg-brand-dark border border-brand-surfaceHighlight rounded-lg px-4 py-3 text-white text-sm focus:border-brand-primary outline-none"
                  />
                  <div className="hidden md:block" />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    className="bg-brand-dark border border-brand-surfaceHighlight rounded-lg px-4 py-3 text-white text-sm focus:border-brand-primary outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="bg-brand-dark border border-brand-surfaceHighlight rounded-lg px-4 py-3 text-white text-sm focus:border-brand-primary outline-none"
                  />
              </div>
              <div className="flex justify-end pt-2">
                  <button 
                    onClick={handleSaveSecurity}
                    disabled={!formData.currentPassword || !formData.newPassword}
                    className="px-6 py-2 bg-brand-surfaceHighlight hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      Update Password
                  </button>
              </div>
          </div>
      </div>
  );

  const AppearanceView = () => (
      <div className="max-w-3xl animate-fade-in space-y-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Appearance</h3>
            <p className="text-gray-400 text-sm">Customize the look and feel of your workspace.</p>
          </div>

          <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Interface Theme</label>
              <div className="grid grid-cols-3 gap-4">
                  {[
                      { id: 'dark', label: 'Dark Mode', icon: Moon },
                      { id: 'light', label: 'Light Mode', icon: Sun },
                      { id: 'system', label: 'System', icon: Monitor }
                  ].map((item) => (
                      <button
                        key={item.id}
                        // @ts-ignore
                        onClick={() => { setTheme(item.id); showToast(`Theme set to ${item.label}`); }}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${
                            theme === item.id 
                            ? 'bg-brand-primary/20 border-brand-primary text-white' 
                            : 'bg-brand-dark border-brand-surfaceHighlight text-gray-400 hover:border-gray-500'
                        }`}
                      >
                          <item.icon size={24} />
                          <span className="text-sm font-medium">{item.label}</span>
                      </button>
                  ))}
              </div>
          </div>

          <div className="pt-6 border-t border-brand-surfaceHighlight space-y-6">
              <div className="flex items-center justify-between">
                  <div>
                      <h4 className="text-white font-medium">Compact Mode</h4>
                      <p className="text-xs text-gray-500 mt-1">Reduce spacing in chat and lists.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('compactMode')}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                        toggles.compactMode ? 'bg-brand-primary' : 'bg-gray-700'
                    }`}
                  >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                          toggles.compactMode ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                  </button>
              </div>
          </div>
      </div>
  );

  const BillingView = () => (
      <div className="max-w-4xl animate-fade-in space-y-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Billing & Plans</h3>
            <p className="text-gray-400 text-sm">Manage your subscription and invoices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Plan */}
              <div className="md:col-span-2 bg-gradient-to-br from-brand-primary/20 to-brand-accent/10 border border-brand-primary/30 rounded-xl p-6 relative overflow-hidden">
                  <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <span className="text-brand-accent text-xs font-bold uppercase tracking-wider mb-1 block">Current Plan</span>
                              <h2 className="text-3xl font-bold text-white">Pro Plan</h2>
                          </div>
                          <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-medium">
                              $29/mo
                          </span>
                      </div>
                      <ul className="space-y-2 mb-6">
                          <li className="flex items-center text-sm text-gray-200"><CheckCircle size={14} className="mr-2 text-brand-primary" /> Unlimited Personas</li>
                          <li className="flex items-center text-sm text-gray-200"><CheckCircle size={14} className="mr-2 text-brand-primary" /> Priority GPU Access</li>
                          <li className="flex items-center text-sm text-gray-200"><CheckCircle size={14} className="mr-2 text-brand-primary" /> 1M Tokens / Month</li>
                      </ul>
                      <div className="flex gap-3">
                          <button className="px-4 py-2 bg-white text-brand-dark font-bold text-sm rounded-lg hover:bg-gray-100 transition-colors">
                              Upgrade Plan
                          </button>
                          <button className="px-4 py-2 bg-transparent border border-white/20 text-white font-medium text-sm rounded-lg hover:bg-white/10 transition-colors">
                              Cancel Subscription
                          </button>
                      </div>
                  </div>
              </div>

              {/* Payment Method */}
              <div className="bg-brand-dark border border-brand-surfaceHighlight rounded-xl p-6 flex flex-col justify-between">
                  <div>
                      <h4 className="text-white font-medium mb-4">Payment Method</h4>
                      <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-brand-surfaceHighlight rounded text-white">
                              <CreditCard size={20} />
                          </div>
                          <div>
                              <p className="text-sm text-white font-mono">•••• 4242</p>
                              <p className="text-xs text-gray-500">Expires 12/26</p>
                          </div>
                      </div>
                  </div>
                  <button className="text-xs text-brand-primary hover:text-brand-accent text-left mt-4">
                      Update Card
                  </button>
              </div>
          </div>

          {/* Invoices */}
          <div className="bg-brand-surface border border-brand-surfaceHighlight rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-brand-surfaceHighlight flex justify-between items-center">
                  <h4 className="text-white font-medium">Invoice History</h4>
                  <button className="text-xs text-brand-primary hover:text-white transition-colors flex items-center">
                      Download All <Download size={12} className="ml-1" />
                  </button>
              </div>
              <div className="divide-y divide-brand-surfaceHighlight">
                  {[
                      { date: 'Oct 01, 2024', amount: '$29.00', status: 'Paid', id: 'INV-001' },
                      { date: 'Sep 01, 2024', amount: '$29.00', status: 'Paid', id: 'INV-002' },
                      { date: 'Aug 01, 2024', amount: '$29.00', status: 'Paid', id: 'INV-003' },
                  ].map((inv) => (
                      <div key={inv.id} className="px-6 py-4 flex items-center justify-between hover:bg-brand-surfaceHighlight/10 transition-colors">
                          <div className="flex items-center gap-4">
                              <div className="p-2 bg-brand-surfaceHighlight/30 rounded-lg text-gray-400">
                                  <Download size={16} />
                              </div>
                              <div>
                                  <p className="text-sm text-white font-medium">{inv.date}</p>
                                  <p className="text-xs text-gray-500">Invoice #{inv.id}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-4">
                              <span className="text-sm text-white">{inv.amount}</span>
                              <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20">
                                  {inv.status}
                              </span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const HelpView = () => (
      <div className="max-w-2xl animate-fade-in space-y-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Help & Support</h3>
            <p className="text-gray-400 text-sm">Documentation, FAQs and contact support.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-brand-dark border border-brand-surfaceHighlight rounded-xl text-left hover:border-brand-primary/50 transition-all group">
                  <ExternalLink size={20} className="text-brand-primary mb-3" />
                  <h4 className="text-white font-medium mb-1 group-hover:text-brand-primary transition-colors">Documentation</h4>
                  <p className="text-xs text-gray-500">Read the full integration guides.</p>
              </button>
              <button className="p-4 bg-brand-dark border border-brand-surfaceHighlight rounded-xl text-left hover:border-brand-primary/50 transition-all group">
                  <AlertCircle size={20} className="text-brand-accent mb-3" />
                  <h4 className="text-white font-medium mb-1 group-hover:text-brand-accent transition-colors">Report a Bug</h4>
                  <p className="text-xs text-gray-500">Let us know if something's broken.</p>
              </button>
          </div>

          <div className="space-y-4">
              <h4 className="text-white font-bold">Frequently Asked Questions</h4>
              {[
                  { q: "How do I train a new persona?", a: "Navigate to the Persona Builder, upload your knowledge base documents, and click 'Start Training'. The process usually takes 5-10 minutes." },
                  { q: "Can I export my data?", a: "Yes, you can export all chat logs and persona configurations from the 'Data Sharing' tab in Settings." },
                  { q: "What models are supported?", a: "We currently support Gemini 2.5 Flash for speed and Gemini 3 Pro for complex reasoning tasks." }
              ].map((faq, i) => (
                  <div key={i} className="bg-brand-surface border border-brand-surfaceHighlight rounded-xl p-4">
                      <h5 className="text-white text-sm font-semibold mb-2">{faq.q}</h5>
                      <p className="text-gray-400 text-xs leading-relaxed">{faq.a}</p>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderContent = () => {
      switch(activeTab) {
          case 'profile': return <ProfileView />;
          case 'api': return <ApiView />;
          case 'notifications': return <NotificationsView />;
          case 'security': return <SecurityView />;
          case 'appearance': return <AppearanceView />;
          case 'billing': return <BillingView />;
          case 'help': return <HelpView />;
          default: return <ProfileView />;
      }
  };

  return (
    <div className="p-8 h-full overflow-y-auto animate-fade-in relative">
      {/* Toast Notification */}
      {toast && (
          <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-fade-in ${
              toast.type === 'success' ? 'bg-brand-success text-white' : 'bg-red-500 text-white'
          }`}>
              {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="font-medium text-sm">{toast.message}</span>
          </div>
      )}

      <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
           <nav className="space-y-1">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                   activeTab === tab.id
                     ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                     : 'text-gray-400 hover:text-white hover:bg-brand-surfaceHighlight/50'
                 }`}
               >
                 <tab.icon size={18} />
                 <span>{tab.label}</span>
               </button>
             ))}
           </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-brand-surface border border-brand-surfaceHighlight rounded-2xl p-8 min-h-[600px]">
           {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;