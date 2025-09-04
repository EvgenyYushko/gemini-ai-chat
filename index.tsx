import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import AuthGuard from './components/AuthGuard'; // Временно комментируем этот импорт

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Временно рендерим только компонент App, без AuthGuard
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
