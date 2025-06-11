import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CommunityDetails from './CommunityDetails';
import Tutorials from './Tutorials';
import Dashboard from './Dashboard';
import DistrictCommunities from './DistrictCommunities.js';
import HomePage from './HomePage';
import AppDetails from './AppDetails';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Wrap all dashboard-related routes inside Dashboard layout */}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<HomePage />} /> {/* Default route inside Dashboard */}
          <Route path="districts" element={<DistrictCommunities />} />
          <Route path="app" element={<AppDetails />} />
          <Route path="talukas" element={<h2>Taluka Communities Page (Coming Soon)</h2>} />
          {/* <Route path="app" element={
            <div style={{ padding: '1rem' }}>
              <h2 className="text-xl font-semibold mb-3">📱 E-Guruji App</h2>
              <p className="mb-3">Download the app from the Play Store:</p>
              <a
                href="https://play.google.com/store/apps/details?id=com.spark.smartguruji"
                target="_blank"
                rel="noopener noreferrer"
                className="download-app-button"
              >
                Go to Play Store 🚀
              </a>
            </div>
          } /> */}

          {/* ✅ Move CommunityDetails inside Dashboard */}
          <Route path="community/:communityName/:threadId" element={<CommunityDetails />} />
        </Route>

        {/* Other independent pages */}
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="*" element={<div className="p-4">404: No matching route found</div>} />
      </Routes>
    </div>
  );
}

export default App;
