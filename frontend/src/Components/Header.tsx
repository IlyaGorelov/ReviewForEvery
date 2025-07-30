// src/components/Header.tsx
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Логотип */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          ReviewForEvery
        </Link>

        {/* Кнопки справа */}
        <div className="flex items-center gap-4">
          {/* Кнопка "Оставить отзыв" */}
          <Link
            to="/add"
            className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
          >
            Оставить отзыв
          </Link>

          {/* Вход */}
          <Link
            to="/login"
            className="px-4 py-2 text-sm text-blue-600 hover:underline"
          >
            Войти
          </Link>

          {/* Регистрация */}
          <Link
            to="/register"
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </header>
  );
}
