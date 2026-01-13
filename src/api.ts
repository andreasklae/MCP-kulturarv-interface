import { ChatRequest, ChatResponse, ChatStatus, SSEEvent } from './types';

const API_BASE = 'https://kulturarv-mcp-server.gentleplant-37ecd527.swedencentral.azurecontainerapps.io';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Check if chat is available and get configuration.
 */
export async function checkChatStatus(): Promise<ChatStatus> {
  const response = await fetch(`${API_BASE}/api/chat/status`);
  
  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to check chat status');
  }
  
  return response.json();
}

/**
 * Send a message (non-streaming).
 * Returns the full structured response.
 */
export async function sendMessage(
  token: string,
  request: ChatRequest
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    
    if (response.status === 401) {
      throw new ApiError(401, 'Invalid access token. Please check your token and try again.');
    }
    
    if (response.status === 429) {
      throw new ApiError(429, data.message || 'Rate limit exceeded. Please wait before sending more messages.');
    }
    
    throw new ApiError(response.status, data.error || 'Failed to send message');
  }
  
  return response.json();
}

/**
 * Callbacks for streaming events.
 */
export interface StreamCallbacks {
  onStatus?: (message: string) => void;
  onToolStart?: (tool: string, args: Record<string, unknown>) => void;
  onToolEnd?: (tool: string, success: boolean, preview?: string) => void;
  onToken?: (content: string) => void;
  onDone?: (response: ChatResponse) => void;
  onError?: (message: string) => void;
}

/**
 * Send a message with streaming response.
 * Calls the appropriate callback for each event type.
 * Returns an abort function to stop the stream.
 */
export async function sendMessageStream(
  token: string,
  request: ChatRequest,
  callbacks: StreamCallbacks,
  abortSignal?: AbortSignal
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
    signal: abortSignal,
  });
  
  if (!response.ok) {
    // Try to parse error from response body
    const text = await response.text();
    
    if (response.status === 401) {
      throw new ApiError(401, 'Invalid access token. Please check your token and try again.');
    }
    
    if (response.status === 429) {
      throw new ApiError(429, 'Rate limit exceeded. Please wait before sending more messages.');
    }
    
    throw new ApiError(response.status, text || 'Failed to send message');
  }
  
  // Read the SSE stream
  const reader = response.body?.getReader();
  if (!reader) {
    throw new ApiError(500, 'No response body');
  }
  
  const decoder = new TextDecoder();
  let buffer = '';
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete events (separated by double newlines or single newlines)
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('data:')) {
          const dataStr = trimmedLine.slice(5).trim();
          
          if (dataStr) {
            try {
              const data = JSON.parse(dataStr) as SSEEvent;
              // Use data.type to determine event type (more reliable than event: line)
              processEvent(data, callbacks);
            } catch (e) {
              console.warn('Failed to parse SSE data:', dataStr, e);
            }
          }
        } else if (trimmedLine.startsWith('event:')) {
          // Skip event type lines - we use data.type instead
        }
        // Empty lines just separate events, no action needed
      }
    }
    
    // Process any remaining data in the buffer
    if (buffer.trim()) {
      const trimmedBuffer = buffer.trim();
      if (trimmedBuffer.startsWith('data:')) {
        const dataStr = trimmedBuffer.slice(5).trim();
        if (dataStr) {
          try {
            const data = JSON.parse(dataStr) as SSEEvent;
            processEvent(data, callbacks);
          } catch (e) {
            console.warn('Failed to parse final SSE data:', dataStr, e);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Process a single SSE event and call the appropriate callback.
 */
function processEvent(event: SSEEvent, callbacks: StreamCallbacks): void {
  // Log all events to console
  console.log(`[API] SSE Event:`, event);
  
  switch (event.type) {
    case 'status':
      console.log(`[API] Status: ${event.message}`);
      callbacks.onStatus?.(event.message);
      break;
    case 'tool_start':
      console.log(`[API] Tool Start: ${event.tool}`, event.arguments);
      callbacks.onToolStart?.(event.tool, event.arguments);
      break;
    case 'tool_end':
      console.log(`[API] Tool End: ${event.tool} (success: ${event.success})`, event.preview);
      callbacks.onToolEnd?.(event.tool, event.success, event.preview);
      break;
    case 'token':
      // Don't log individual tokens to avoid spam, but log that we received one
      callbacks.onToken?.(event.content);
      break;
    case 'done':
      console.log(`[API] Done - Full Response:`, event.response);
      callbacks.onDone?.(event.response);
      break;
    case 'error':
      console.error(`[API] Error: ${event.message}`);
      callbacks.onError?.(event.message);
      break;
  }
}
