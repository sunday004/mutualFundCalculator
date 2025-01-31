import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MutualFundCalculator from './pages/MutualFundCalculator';
import HistoryPage from './pages/HistoryPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/calculator" element={<MutualFundCalculator />} />
        <Route path="/History" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
};

export default App;
