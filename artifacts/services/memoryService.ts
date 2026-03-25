import { MemBrainClient } from '../lib/memBrain';

const client = new MemBrainClient(process.env.MEMBRAIN_API_KEY || '');

export async function getLearningPath(studentId: string) {
  try {
    const result = await client.searchMemories(
      `student ${studentId} learning path recommendation`,
      5,
      'interpreted'
    );
    return result.interpretation || "Continue practicing your current concepts";
  } catch (error) {
    console.error('Error getting learning path:', error);
    return "Complete your next lesson to get personalized recommendations";
  }
}

export async function getUpcomingReviews(studentId: string) {
  try {
    const result = await client.searchMemories(
      `student ${studentId} concepts due for review`,
      10,
      'raw'
    );
    
    if (!result.memories) return [];
    
    return result.memories.map((memory: any) => ({
      concept: extractConcept(memory),
      due: "Today",
      retention: 65,
    }));
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
}

export async function getKnowledgeGaps(studentId: string) {
  try {
    const result = await client.searchMemories(
      `student ${studentId} knowledge gaps`,
      5,
      'interpreted'
    );
    return result.interpretation || "No significant gaps identified";
  } catch (error) {
    console.error('Error getting knowledge gaps:', error);
    return "Complete more assessments to identify knowledge gaps";
  }
}

function extractConcept(memory: any): string {
  if (memory.tags) {
    const tag = memory.tags.find((t: string) => t.startsWith('concept.'));
    if (tag) return tag.replace('concept.', '').replace(/-/g, ' ');
  }
  return "Unknown Concept";
}