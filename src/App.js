import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CommunityDetails from './CommunityDetails';
import Home from './Home.js';
import Tutorials from './Tutorials';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community/:communityName/:threadId" element={<CommunityDetails />} />
        <Route path="*" element={<div className="p-4">404: No matching route found</div>} />
        <Route path="/tutorials" element={<Tutorials />} />
      </Routes>
    </div>
  );
}

export default App;