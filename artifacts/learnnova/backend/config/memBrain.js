const MEMBRAIN_BASE_URL = 'https://mem-brain-api-cutover-v4-production.up.railway.app/api/v1';

class MemBrainClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = MEMBRAIN_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mem-Brain API error: ${response.status} - ${error}`);
    }
    
    return response.json();
  }

  async storeMemory(content, tags, category = 'learning') {
    console.log('📝 Storing memory:', { content: content.substring(0, 50), tags });
    return this.request('/memories', {
      method: 'POST',
      body: JSON.stringify({
        content,
        tags,
        category
      })
    });
  }

  async pollJob(jobId, maxAttempts = 10, interval = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
      const result = await this.request(`/jobs/${jobId}`);
      if (result.status === 'completed') {
        console.log('✅ Job completed:', jobId);
        return result;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    throw new Error('Job polling timeout');
  }

  async searchMemories(query, k = 5, responseFormat = 'interpreted') {
    console.log('🔍 Searching memories:', query);
    return this.request('/memories/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        k,
        response_format: responseFormat
      })
    });
  }
}

module.exports = MemBrainClient;