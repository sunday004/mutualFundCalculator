import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/calculator">Calculator</Link>
      <Link to="/history">History</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
};

export default Navigation;