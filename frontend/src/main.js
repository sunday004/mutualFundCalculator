import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';  // Change to .js if needed
import './index.css';  // Ensure this file exists

ReactDOM.createRoot(document.getElementById('root')).render(
    React.createElement(React.StrictMode, null, React.createElement(App))
  );
