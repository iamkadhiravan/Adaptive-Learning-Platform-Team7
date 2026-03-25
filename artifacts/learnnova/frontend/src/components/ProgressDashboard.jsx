import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';

function ProgressDashboard({ studentId }) {
  const [progress, setProgress] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [studentId]);

  const loadData = async () => {
    setLoading(true);
    const progressData = await studentAPI.getProgress(studentId);
    const reviewData = await studentAPI.getReviewSession(studentId);
    setProgress(progressData);
    setReview(reviewData);
    setLoading(false);
  };

  if (loading) return <div>Loading progress...</div>;

  return (
    <div className="dashboard">
      <h2>📊 Your Learning Progress</h2>
      
      <div className="concepts-grid">
        {progress?.concepts?.map((item, index) => (
          <div key={index} className="concept-card">
            <h3>{item.concept}</h3>
            <div className="mastery-bar">
              <div 
                className="mastery-fill" 
                style={{ width: `${item.mastery}%` }}
              />
            </div>
            <span>{item.mastery}% Mastery</span>
          </div>
        ))}
      </div>
      
      {review?.conceptsToReview?.length > 0 && (
        <div className="review-section">
          <h3>🔄 Due for Review</h3>
          <ul>
            {review.conceptsToReview.map((concept, i) => (
              <li key={i}>{concept}</li>
            ))}
          </ul>
          <p className="recommendation">{review.recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default ProgressDashboard;