class ProgressTracker {
    constructor(memBrainClient, studentId) {
      this.client = memBrainClient;
      this.studentId = studentId;
    }
  
    async recordConceptAttempt(concept, question, answer, isCorrect) {
      const content = `Student attempted concept "${concept}". Question: "${question}". Answer: "${answer}". Result: ${isCorrect ? 'CORRECT' : 'INCORRECT'}`;
      
      const tags = [
        `student.${this.studentId}`,
        `concept.${concept.toLowerCase().replace(/\s/g, '-')}`,
        `type.attempt`,
        `outcome.${isCorrect ? 'success' : 'failure'}`
      ];
      
      const result = await this.client.storeMemory(content, tags, 'learning-attempt');
      
      if (result.job_id) {
        await this.client.pollJob(result.job_id);
      }
      
      return result;
    }
  
    async recordConceptMastery(concept, masteryScore, notes = '') {
      const content = `Student achieved ${masteryScore}% mastery on concept "${concept}". ${notes}`;
      
      const tags = [
        `student.${this.studentId}`,
        `concept.${concept.toLowerCase().replace(/\s/g, '-')}`,
        `type.mastery`,
        `score.${Math.floor(masteryScore / 10) * 10}`
      ];
      
      return this.client.storeMemory(content, tags, 'mastery-update');
    }
  
    async getStudentContext(query) {
      const enhancedQuery = `For student ${this.studentId}: ${query}`;
      return this.client.searchMemories(enhancedQuery, 10, 'interpreted');
    }
  
    async getStudentProgress() {
      const result = await this.client.searchMemories(
        `student ${this.studentId} concept mastery`,
        20,
        'raw'
      );
      
      const concepts = [];
      if (result.memories) {
        result.memories.forEach(memory => {
          const conceptMatch = memory.content.match(/concept "([^"]+)"/i);
          const scoreMatch = memory.content.match(/(\d+)%/);
          if (conceptMatch && scoreMatch) {
            concepts.push({
              concept: conceptMatch[1],
              mastery: parseInt(scoreMatch[1])
            });
          }
        });
      }
      
      return { studentId: this.studentId, concepts };
    }
  }
  
  module.exports = ProgressTracker;