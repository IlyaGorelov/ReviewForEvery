import { Link } from 'react-router-dom';
import welcomeImage from './Welcome.jpg';

export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 py-12 max-w-7xl mx-auto">
      {/* Левая часть */}
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Добро пожаловать в ReviewForEvery
        </h1>
        <p className="text-lg text-gray-600">
          Здесь вы можете читать отзывы других пользователей, оставлять свои, оценивать продукты и делиться мнением.
        </p>
        <Link
          to="/add"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition"
        >
          Поиск
        </Link>
      </div>

      {/* Правая часть */}
      <div className="md:w-1/2 mt-10 md:mt-0">
        <img
          src={welcomeImage}
          alt="Welcome"
          className="w-full max-w-md mx-auto"
        />
      </div>
    </div>
  );
}
