import { ChatRequest, ChatResponse, ChatStatus } from './types';

const API_BASE = 'https://kulturarv-mcp-server.gentleplant-37ecd527.swedencentral.azurecontainerapps.io';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function checkChatStatus(): Promise<ChatStatus> {
  const response = await fetch(`${API_BASE}/api/chat/status`);
  
  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to check chat status');
  }
  
  return response.json();
}

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
