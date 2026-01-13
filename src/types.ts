// =============================================================================
// Request/Response Types
// =============================================================================

export interface ChatRequest {
  message: string;
  sources: string[];
  conversation_history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface SourceReference {
  title: string;
  url: string;
  provider: string;
  snippet?: string;
}

export interface Location {
  name: string;
  lat: number;
  lng: number;
  type: string;
}

export interface ResponseContent {
  text: string;
  summary?: string;
}

export interface ChatResponseMetadata {
  tools_used: string[];
  providers_consulted: string[];
  processing_time_ms: number;
  model: string;
}

export interface ChatResponse {
  response: ResponseContent;
  sources: SourceReference[];
  locations: Location[];
  related_queries: string[];
  metadata: ChatResponseMetadata;
}

export interface ChatStatus {
  enabled: boolean;
  rate_limit_per_hour: number;
  sources_available: string[];
  streaming_supported?: boolean;
}

// =============================================================================
// SSE Event Types
// =============================================================================

export interface StatusEvent {
  type: 'status';
  message: string;
}

export interface ToolStartEvent {
  type: 'tool_start';
  tool: string;
  arguments: Record<string, unknown>;
}

export interface ToolEndEvent {
  type: 'tool_end';
  tool: string;
  success: boolean;
  preview?: string;
}

export interface TokenEvent {
  type: 'token';
  content: string;
}

export interface DoneEvent {
  type: 'done';
  response: ChatResponse;
}

export interface ErrorEvent {
  type: 'error';
  message: string;
}

export type SSEEvent = StatusEvent | ToolStartEvent | ToolEndEvent | TokenEvent | DoneEvent | ErrorEvent;

// =============================================================================
// UI Types
// =============================================================================

export interface ToolStatus {
  tool: string;
  status: 'calling' | 'completed' | 'failed';
  preview?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  // Structured response data (for assistant messages)
  sources?: SourceReference[];
  locations?: Location[];
  relatedQueries?: string[];
  toolsUsed?: string[];
  providersConsulted?: string[];
  processingTimeMs?: number;
  // Streaming state
  isStreaming?: boolean;
  toolStatuses?: ToolStatus[];
}

// =============================================================================
// Source Configuration
// =============================================================================

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

// Tool name to friendly display name mapping
export const TOOL_DISPLAY_NAMES: Record<string, string> = {
  'wikipedia-search': 'Wikipedia Search',
  'wikipedia-summary': 'Wikipedia Summary',
  'wikipedia-geosearch': 'Wikipedia Geosearch',
  'snl-search': 'SNL Search',
  'snl-article': 'SNL Article',
  'riksantikvaren-datasets': 'Riksantikvaren Datasets',
  'riksantikvaren-collections': 'Riksantikvaren Collections',
  'riksantikvaren-features': 'Riksantikvaren Features',
  'riksantikvaren-nearby': 'Riksantikvaren Nearby',
  'arcgis-services': 'ArcGIS Services',
  'arcgis-query': 'ArcGIS Query',
  'arcgis-nearby': 'ArcGIS Nearby',
};

export function getToolDisplayName(toolName: string): string {
  return TOOL_DISPLAY_NAMES[toolName] || toolName;
}

export function getToolProvider(toolName: string): Source {
  if (toolName.startsWith('wikipedia-')) return 'wikipedia';
  if (toolName.startsWith('snl-')) return 'snl';
  return 'riksantikvaren';
}
