import React, { useState } from 'react';
import { studentAPI } from '../services/api';

function ChatInterface({ studentId }) {
  const [concept, setConcept] = useState('Algebra');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await studentAPI.submitAttempt(studentId, concept, question, answer);
    setFeedback(result);
    setLoading(false);
    
    // Clear answer after submission
    setAnswer('');
  };

  return (
    <div className="chat-interface">
      <h2>🎓 AI Tutor</h2>
      
      <div className="concept-selector">
        <label>Current Topic:</label>
        <select value={concept} onChange={(e) => setConcept(e.target.value)}>
          <option>Algebra</option>
          <option>Quadratic Equations</option>
          <option>Calculus</option>
          <option>Arithmetic</option>
        </select>
      </div>
      
      <div className="question-area">
        <label>Question:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What is 2x + 5 = 15?"
        />
      </div>
      
      <div className="answer-area">
        <label>Your Answer:</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows="3"
        />
      </div>
      
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Checking...' : 'Submit Answer'}
      </button>
      
      {feedback && (
        <div className="feedback">
          <h3>📝 Feedback</h3>
          <p className={feedback.isCorrect ? 'correct' : 'incorrect'}>
            {feedback.feedback}
          </p>
          <div className="context">
            <strong>Context:</strong> {feedback.context}
          </div>
          <div className="next-steps">
            <strong>Next Steps:</strong> {feedback.nextSteps}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;