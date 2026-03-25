import { MemBrainClient } from "../../../../lib/mem-brain/client";

export class MemoryService {
  private client: MemBrainClient;

  constructor(apiKey: string) {
    this.client = new MemBrainClient(apiKey);
  }

  async getLearningPath(studentId: string) {
    const result = (await this.client.searchMemories(
      `student ${studentId} learning path recommendation based on knowledge gaps and forgetting curve`,
      5,
      'interpreted'
    )) as any;
    return result.interpretation || "Continue practicing your current concepts";
  }

  async getUpcomingReviews(studentId: string) {
    const result = (await this.client.searchMemories(
      `student ${studentId} concepts due for review with low retention`,
      10,
      'raw'
    )) as any;
    
    if (!result.memories) return [];
    
    return result.memories.map((memory: any) => ({
      concept: this.extractConcept(memory),
      due: this.calculateDueDate(memory),
      retention: this.extractRetention(memory),
    }));
  }

  async getKnowledgeGaps(studentId: string) {
    const result = (await this.client.searchMemories(
      `student ${studentId} knowledge gaps and concepts needing improvement`,
      5,
      'interpreted'
    )) as any;
    return result.interpretation || "No significant gaps identified";
  }

  async recordActivity(studentId: string, concept: string, action: string, xpGained: number) {
    return this.client.storeMemory(
      `Student ${studentId} ${action} on ${concept}. Gained ${xpGained} XP.`,
      [`student.${studentId}`, `concept.${concept}`, `type.activity`],
      'activity'
    );
  }

  private extractConcept(memory: any): string {
    if (memory.tags) {
      const tag = memory.tags.find((t: string) => t.startsWith('concept.'));
      if (tag) return tag.replace('concept.', '').replace(/-/g, ' ');
    }
    const match = memory.content?.match(/concept "([^"]+)"/i);
    return match ? match[1] : "Unknown";
  }

  private calculateDueDate(memory: any): string {
    // Simple logic - can be enhanced
    return "Today";
  }

  private extractRetention(memory: any): number {
    const match = memory.content?.match(/(\d+)%/);
    return match ? parseInt(match[1]) : 0;
  }
}