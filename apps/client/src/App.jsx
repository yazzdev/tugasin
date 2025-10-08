import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BoardPage from './pages/BoardPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/board/:boardId" element={<BoardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;