// src/components/Header.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../Context/useAuth";

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        {/* Логотип */}
        <Link to="/" className="text-2xl font-bold text-blue-600 mb-3 sm:mb-0">
          ReviewForEvery
        </Link>

        {/* Кнопки справа */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            to="/add"
            className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition text-center"
          >
            Оставить отзыв
          </Link>

          {isLoggedIn() ? (
            <>
              <Link
                to="/account"
                className="px-4 py-2 text-sm text-blue-600 hover:underline text-center"
              >
                Привет, {user?.userName}
              </Link>

              <button
                onClick={logout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-blue-700 text-center"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-blue-600 hover:underline text-center"
              >
                Войти
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
              >
                Создать аккаунт
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
