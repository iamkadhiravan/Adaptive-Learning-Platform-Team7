const MEMBRAIN_BASE_URL = 'https://mem-brain-api-cutover-v4-production.up.railway.app/api/v1';

export class MemBrainClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${MEMBRAIN_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!response.ok) throw new Error(`Mem-Brain error: ${response.status}`);
    return response.json();
  }

  async storeMemory(content: string, tags: string[], category: string = 'learning') {
    return this.request('/memories', {
      method: 'POST',
      body: JSON.stringify({ content, tags, category }),
    });
  }

  async searchMemories(query: string, k: number = 5, responseFormat: 'raw' | 'interpreted' = 'interpreted') {
    return this.request('/memories/search', {
      method: 'POST',
      body: JSON.stringify({ query, k, response_format: responseFormat }),
    });
  }
}