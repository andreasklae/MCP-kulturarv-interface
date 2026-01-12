export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
  sourcesConsulted?: string[];
}

export interface ChatRequest {
  message: string;
  sources: string[];
  conversation_history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface ChatResponse {
  response: string;
  tools_used: string[];
  sources_consulted: string[];
}

export interface ChatStatus {
  enabled: boolean;
  rate_limit_per_hour: number;
  sources_available: string[];
}

export type Source = 'wikipedia' | 'snl' | 'riksantikvaren';

export const SOURCE_INFO: Record<Source, { name: string; description: string; color: string }> = {
  wikipedia: {
    name: 'Wikipedia',
    description: 'Encyclopedic articles',
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  snl: {
    name: 'SNL',
    description: 'Store norske leksikon',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  riksantikvaren: {
    name: 'Riksantikvaren',
    description: 'Kulturminnedatabasen',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
};
