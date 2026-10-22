// src/main.jsx - React 18 entry point mounting App to DOM
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // WHY: Import global design tokens, animations, and styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
