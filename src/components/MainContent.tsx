import React from 'react';
import DashPlayer from './DashPlayer';

const MainContent: React.FC = () => {
  return (
    <main className="main-content">
      <div className="description">
        <p>
            RaptVideo uses AI-driven video intelligence to simplify your video management. 
            With video summarization, poster creation, and trailer generation, we optimize 
            your content for a seamless streaming experience, allowing you to focus on engaging your audience.
        </p>
      </div>
      <div className="launch-soon">
        <h2>Launching<br />soon</h2>
      </div>
    </main>
  );
}

export default MainContent;
