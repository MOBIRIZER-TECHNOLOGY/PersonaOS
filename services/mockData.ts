
import { Persona, PersonaType, Source, MarketplaceItem, ChatMessage } from '../types';

export const MOCK_PERSONAS: Persona[] = [
  {
    id: 'p1',
    name: 'Sarah Chen',
    role: 'Product Strategy Lead',
    description: 'Expert in SaaS product loops and growth metrics. Direct, analytical, and professional.',
    type: PersonaType.EXPERT,
    avatarUrl: 'https://picsum.photos/200/200',
    status: 'active',
    visibility: 'public',
    config: {
      identity: { tone: 'Professional', objective: 'Advise on product' },
      personality: { formalCasual: 20, directDiplomatic: 80, seriousPlayful: 10, analyticalEmotional: 90, calmExpressive: 40 }
    }
  },
  {
    id: 'p2',
    name: 'Marcus Aurelius',
    role: 'Stoic Philosopher',
    description: 'A digital recreation of the Roman Emperor. Focuses on resilience, logic, and virtue.',
    type: PersonaType.CHARACTER,
    avatarUrl: 'https://picsum.photos/201/201',
    status: 'active',
    visibility: 'marketplace',
    config: {
      identity: { tone: 'Philosophical', objective: 'Teach stoicism' },
      personality: { formalCasual: 0, directDiplomatic: 50, seriousPlayful: 0, analyticalEmotional: 60, calmExpressive: 10 }
    }
  }
];

export const MOCK_SOURCES: Source[] = [
  { id: 's1', title: 'Q3_Financial_Report.pdf', type: 'pdf', status: 'ready', updatedAt: '2 hours ago', size: '2.4 MB' },
  { id: 's2', title: 'Product_Roadmap_2025.docx', type: 'text', status: 'ready', updatedAt: '5 hours ago', size: '150 KB' },
  { id: 's3', title: 'Competitor Analysis - YouTube', type: 'video', status: 'processing', updatedAt: 'Just now', size: 'Unknown' },
  { id: 's4', title: 'https://stripe.com/docs/api', type: 'url', status: 'ready', updatedAt: '1 day ago', size: '1.2 MB' },
];

export const MOCK_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'm1',
    persona: { ...MOCK_PERSONAS[0], name: 'Sales Pro', role: 'Sales Expert', description: 'Expert sales persona trained on top sales methodologies and negotiation tactics.' },
    price: null,
    tags: ['Business', 'Sales'],
    downloads: 2456,
    rating: 4.8,
    author: 'SalesAI'
  },
  {
    id: 'm2',
    persona: { ...MOCK_PERSONAS[1], name: 'Dr. Wellness', role: 'Health Consultant', description: 'Holistic health advisor covering nutrition, fitness, and mental wellness.' },
    price: 9.99,
    tags: ['Health', 'Wellness'],
    downloads: 3892,
    rating: 4.9,
    author: 'HealthTech'
  },
  {
    id: 'm3',
    persona: { 
      id: 'p3', name: 'Code Master', role: 'Senior Developer', description: 'Expert developer persona with deep knowledge in multiple programming languages.', 
      type: PersonaType.EXPERT, status: 'active', visibility: 'marketplace', config: { identity: { tone: 'Technical', objective: 'Code' }, personality: { formalCasual: 50, directDiplomatic: 50, seriousPlayful: 50, analyticalEmotional: 90, calmExpressive: 50 } } 
    },
    price: null,
    tags: ['Technology', 'Development'],
    downloads: 5621,
    rating: 4.7,
    author: 'DevGuru'
  },
  {
    id: 'm4',
    persona: { 
      id: 'p4', name: 'Story Weaver', role: 'Creative Writer', description: 'Master storyteller creating engaging narratives across all genres.', 
      type: PersonaType.CHARACTER, status: 'active', visibility: 'marketplace', config: { identity: { tone: 'Creative', objective: 'Write' }, personality: { formalCasual: 20, directDiplomatic: 20, seriousPlayful: 80, analyticalEmotional: 20, calmExpressive: 90 } } 
    },
    price: 4.99,
    tags: ['Creative', 'Writing'],
    downloads: 1205,
    rating: 4.6,
    author: 'NarrativeLabs'
  },
  {
    id: 'm5',
    persona: { 
      id: 'p5', name: 'Math Tutor', role: 'Mathematics Teacher', description: 'Patient and thorough math tutor from basic arithmetic to advanced calculus.', 
      type: PersonaType.EXPERT, status: 'active', visibility: 'marketplace', config: { identity: { tone: 'Patient', objective: 'Teach Math' }, personality: { formalCasual: 60, directDiplomatic: 50, seriousPlayful: 30, analyticalEmotional: 80, calmExpressive: 50 } } 
    },
    price: null,
    tags: ['Education', 'Math'],
    downloads: 892,
    rating: 4.9,
    author: 'EduSoft'
  },
  {
    id: 'm6',
    persona: { 
      id: 'p6', name: 'Contract Analyst', role: 'Legal Expert', description: 'Specialized in reviewing and explaining legal contracts and agreements.', 
      type: PersonaType.EXPERT, status: 'active', visibility: 'marketplace', config: { identity: { tone: 'Formal', objective: 'Analyze Contracts' }, personality: { formalCasual: 100, directDiplomatic: 90, seriousPlayful: 0, analyticalEmotional: 100, calmExpressive: 20 } } 
    },
    price: 14.99,
    tags: ['Legal', 'Business'],
    downloads: 430,
    rating: 4.8,
    author: 'LegalAI'
  }
];

export const INITIAL_CHAT_HISTORY: ChatMessage[] = [
  { id: 'm1', role: 'system', content: 'Persona initialized: Sarah Chen (Product Strategy). Knowledge base loaded.', timestamp: '10:00 AM' },
  { id: 'm2', role: 'assistant', content: 'Hello. I\'m ready to review your product roadmap. I\'ve analyzed the Q3 documents you uploaded. Where should we start?', timestamp: '10:01 AM' }
];
