import { MemBrainClient } from '@workspace/mem-brain';

export class MemoryService {
  private client: MemBrainClient;

  constructor(apiKey: string) {
    this.client = new MemBrainClient(apiKey);
  }
}