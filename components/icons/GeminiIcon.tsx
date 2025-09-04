import React from 'react';

// Это простой функциональный компонент React, который возвращает SVG-разметку для иконки Gemini AI.
const GeminiIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-white"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12.55 2.1a1 1 0 0 0-1.1 0L3.85 7.6A2.5 2.5 0 0 0 3 9.68v4.64a2.5 2.5 0 0 0 .85 1.98l7.6 5.5a1 1 0 0 0 1.1 0l7.6-5.5a2.5 2.5 0 0 0 .85-1.98V9.68a2.5 2.5 0 0 0-.85-1.98zM12 4.41L18.15 9l-3.32 2.4a1.5 1.5 0 0 1-1.66 0L9.85 9zm-6.15 5.5l3.32 2.4a1.5 1.5 0 0 1 0 2.2l-3.32 2.4zm12.3 0l-3.32 2.4a1.5 1.5 0 0 0 0 2.2l3.32 2.4z"/>
  </svg>
);

export default GeminiIcon;
