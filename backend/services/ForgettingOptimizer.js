class ForgettingOptimizer {
    constructor(memBrainClient, studentId) {
      this.client = memBrainClient;
      this.studentId = studentId;
    }
  
    async getConceptsNeedingReview() {
      const oldAttempts = await this.client.searchMemories(
        `student ${this.studentId} concept attempts older than 5 days`,
        20,
        'raw'
      );
      
      const conceptsToReview = [];
      const now = Date.now();
      const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
      
      if (oldAttempts.memories) {
        for (const memory of oldAttempts.memories) {
          const age = now - new Date(memory.created_at).getTime();
          const concept = this.extractConcept(memory);
          
          if (age > FIVE_DAYS_MS && concept && !conceptsToReview.includes(concept)) {
            conceptsToReview.push(concept);
          }
        }
      }
      
      return conceptsToReview;
    }
  
    async generateReviewSession() {
      const concepts = await this.getConceptsNeedingReview();
      
      if (concepts.length === 0) {
        return { message: "No concepts need review right now!" };
      }
      
      const reviewMaterials = [];
      for (const concept of concepts.slice(0, 3)) {
        const context = await this.client.searchMemories(
          `concept ${concept} student ${this.studentId} previous mistakes`,
          5,
          'interpreted'
        );
        
        reviewMaterials.push({
          concept,
          context: context.interpretation || context
        });
      }
      
      return {
        conceptsToReview: concepts,
        reviewMaterials,
        recommendation: `Review ${concepts.slice(0, 3).join(', ')}`
      };
    }
  
    extractConcept(memory) {
      if (memory.tags) {
        const conceptTag = memory.tags.find(t => t.startsWith('concept.'));
        if (conceptTag) {
          return conceptTag.replace('concept.', '').replace(/-/g, ' ');
        }
      }
      const match = memory.content.match(/concept "([^"]+)"/i);
      return match ? match[1] : null;
    }
  }
  
  module.exports = ForgettingOptimizer;