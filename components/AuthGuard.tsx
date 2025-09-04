import React, { useState, useEffect, ReactNode } from 'react';

// URL вашего сервера для проверки аутентификации
const AUTH_CHECK_URL = 'https://telegramantispambot.onrender.com/api/check-auth';
// URL страницы входа, куда будет перенаправлен неавторизованный пользователь
const LOGIN_URL = 'https://telegramantispambot.onrender.com/Account/Login';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // Состояние для отслеживания статуса аутентификации.
  // null - проверка еще не завершена (состояние загрузки).
  // true - пользователь авторизован.
  // false - пользователь не авторизован.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Асинхронная функция для проверки статуса аутентификации на бэкенде.
    const verifyAuth = async () => {
      try {
        // Отправляем запрос на ваш .NET-сервер.
        // `credentials: 'include'` крайне важен - он заставляет браузер отправлять
        // cookie-файлы, связанные с доменом telegramantispambot.onrender.com.
        const response = await fetch(AUTH_CHECK_URL, {
          credentials: 'include',
        });

        if (response.ok) {
          // Если ответ успешный (статус 2xx), считаем пользователя авторизованным.
          setIsAuthenticated(true);
        } else {
          // Любой другой ответ означает, что пользователь не авторизован.
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Если произошла сетевая ошибка, также считаем, что авторизация не пройдена.
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз при монтировании.

  useEffect(() => {
    // Этот эффект следит за изменением состояния isAuthenticated.
    if (isAuthenticated === false) {
      // Если проверка завершилась и пользователь не авторизован,
      // перенаправляем его на страницу входа.
      // Мы добавляем `returnUrl`, чтобы после логина ваш сайт знал, куда вернуть пользователя.
      const returnUrl = window.location.href;
      window.location.href = `${LOGIN_URL}?ReturnUrl=${encodeURIComponent(returnUrl)}`;
    }
  }, [isAuthenticated]);

  // Пока идет проверка (isAuthenticated === null), показываем экран загрузки.
  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-300">Проверка авторизации...</p>
      </div>
    );
  }

  // Если пользователь авторизован, отображаем дочерние компоненты (в нашем случае - компонент <App />).
  // Если не авторизован, возвращаем null, так как скоро произойдет перенаправление.
  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;
