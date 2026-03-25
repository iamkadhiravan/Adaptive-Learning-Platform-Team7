const express = require('express');
const router = express.Router();
const MemBrainClient = require('../config/memBrain');
const ProgressTracker = require('../services/ProgressTracker');
const ForgettingOptimizer = require('../services/ForgettingOptimizer');

const memBrainClient = new MemBrainClient(process.env.MEMBRAIN_API_KEY);

// Record a learning attempt
router.post('/:studentId/attempt', async (req, res) => {
  const { studentId } = req.params;
  const { concept, question, answer } = req.body;
  
  const tracker = new ProgressTracker(memBrainClient, studentId);
  
  try {
    const isCorrect = answer && answer.trim().length > 0;
    
    const result = await tracker.recordConceptAttempt(concept, question, answer, isCorrect);
    
    if (isCorrect) {
      await tracker.recordConceptMastery(concept, 85, "Good understanding");
    }
    
    const context = await tracker.getStudentContext("what to learn next");
    
    res.json({
      success: true,
      isCorrect,
      feedback: isCorrect ? "Great job! 🎉" : "Keep practicing! 📚",
      context: context.interpretation || context,
      nextSteps: isCorrect ? getNextConcept(concept) : `Let's review ${concept}`
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get student progress
router.get('/:studentId/progress', async (req, res) => {
  const { studentId } = req.params;
  const tracker = new ProgressTracker(memBrainClient, studentId);
  
  try {
    const progress = await tracker.getStudentProgress();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get review session
router.get('/:studentId/review', async (req, res) => {
  const { studentId } = req.params;
  const optimizer = new ForgettingOptimizer(memBrainClient, studentId);
  
  try {
    const review = await optimizer.generateReviewSession();
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function getNextConcept(currentConcept) {
  const concepts = {
    'Algebra': 'Quadratic Equations',
    'Quadratic Equations': 'Graphing Parabolas',
    'Arithmetic': 'Algebra',
    'Calculus': 'Derivatives'
  };
  return concepts[currentConcept] || 'Advanced topics';
}

module.exports = router;