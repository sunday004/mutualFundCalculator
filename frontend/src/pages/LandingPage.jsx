import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/LandingPage.css';
import GoldmanSachsLogo from '../styling/assets/Goldman_Sachs.svg.png';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Logo Section */}
      <div className="logo-container">
        <img src={GoldmanSachsLogo} alt='goldman sachs logo' className='goldman-logo'/>
      </div>
      <div className="content">
        <h1>mutual fund calculator.</h1>
        <p>manage your investments effectively.</p>
        <div className="cta-buttons">
          <Link to="/calculator" className="cta-btn">start</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
