import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import ProgressDashboard from './components/ProgressDashboard';
import './App.css';

function App() {
  const [studentId, setStudentId] = useState('student_001');
  const [activeTab, setActiveTab] = useState('learn');

  return (
    <div className="app">
      <header>
        <h1>📚 Adaptive Learning Platform</h1>
        <p>Powered by Mem-Brain API</p>
      </header>
      
      <div className="student-info">
        <label>Student ID:</label>
        <input 
          type="text" 
          value={studentId} 
          onChange={(e) => setStudentId(e.target.value)}
        />
      </div>
      
      <div className="tabs">
        <button onClick={() => setActiveTab('learn')}>Learn</button>
        <button onClick={() => setActiveTab('progress')}>Progress</button>
      </div>
      
      <div className="content">
        {activeTab === 'learn' && <ChatInterface studentId={studentId} />}
        {activeTab === 'progress' && <ProgressDashboard studentId={studentId} />}
      </div>
    </div>
  );
}

export default App;