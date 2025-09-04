// Импортируем необходимые библиотеки из React
import React from 'react';
import ReactDOM from 'react-dom/client';
// Импортируем главный компонент нашего приложения
import App from './App';
// Импортируем новый компонент для проверки авторизации
import AuthGuard from './components/AuthGuard';

// Находим корневой HTML-элемент, в который будет встроено наше приложение.
// В index.html это <div id="root"></div>
const rootElement = document.getElementById('root');
if (!rootElement) {
  // Если элемент не найден, выбрасываем ошибку, так как приложение не сможет запуститься.
  throw new Error("Could not find root element to mount to");
}

// Создаем "корень" для рендеринга React-приложения внутри найденного HTML-элемента.
const root = ReactDOM.createRoot(rootElement);
// Рендерим (отрисовываем) наше приложение.
// <AuthGuard> будет проверять, авторизован ли пользователь.
// Если да, он отобразит <App />, если нет - перенаправит на страницу входа.
// <React.StrictMode> — это специальный компонент, который помогает находить потенциальные проблемы в приложении.
root.render(
  <React.StrictMode>
    <AuthGuard>
      <App />
    </AuthGuard>
  </React.StrictMode>
);
