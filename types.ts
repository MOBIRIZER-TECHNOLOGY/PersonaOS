
// types.ts

export enum PersonaType {
  DIGITAL_YOU = "Digital You",
  EXPERT = "Expert",
  CHARACTER = "Character"
}

export interface PersonaConfig {
  identity: {
    tone: string;
    objective: string;
  };
  personality: {
    formalCasual: number; // 0-100
    directDiplomatic: number;
    seriousPlayful: number;
    analyticalEmotional: number;
    calmExpressive: number;
  };
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarUrl?: string;
  type: PersonaType;
  config: PersonaConfig;
  status: 'active' | 'training' | 'inactive';
  visibility: 'private' | 'public' | 'marketplace';
}

export interface Source {
  id: string;
  title: string;
  type: 'pdf' | 'url' | 'text' | 'audio' | 'video';
  status: 'pending' | 'processing' | 'ready' | 'error';
  summary?: string;
  updatedAt: string;
  size?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: { sourceId: string; text: string }[];
}

export interface MarketplaceItem {
  id: string;
  persona: Persona;
  price: number | null; // null = free
  tags: string[];
  downloads: number;
  rating: number;
  author: string;
}
