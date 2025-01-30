import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="content">
        <h1>Welcome to the Mutual Fund Calculator</h1>
        <p>Manage your investments effectively with our powerful tools.</p>
        <div className="cta-buttons">
          <Link to="/login" className="cta-btn">Login</Link>
          <Link to="/calculator" className="cta-btn">Go to Calculator</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
