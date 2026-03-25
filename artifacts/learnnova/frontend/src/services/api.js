const API_BASE_URL = 'http://localhost:5000/api';

export const studentAPI = {
  // Record a learning attempt
  submitAttempt: async (studentId, concept, question, answer) => {
    const response = await fetch(`${API_BASE_URL}/student/${studentId}/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concept, question, answer })
    });
    return response.json();
  },
  
  // Get student progress
  getProgress: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/student/${studentId}/progress`);
    return response.json();
  },
  
  // Get review session
  getReviewSession: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/student/${studentId}/review`);
    return response.json();
  }
};