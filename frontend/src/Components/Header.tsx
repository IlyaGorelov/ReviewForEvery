// src/components/Header.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../Context/useAuth";

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition"
        >
          ReviewForEvery
        </Link>

        {/* Right side buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/add"
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition shadow-sm"
          >
            Add Review
          </Link>

          {isLoggedIn() ? (
            <>
              <Link
                to="/account"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition text-center"
              >
                Hello, {user?.userName}
              </Link>

              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
