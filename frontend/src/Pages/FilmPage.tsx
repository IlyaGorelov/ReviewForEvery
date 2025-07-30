// src/pages/FilmPage.tsx
import { Link, useParams } from 'react-router-dom';

const mockFilm = {
  id: '1',
  title: 'Inception',
  rating: 9.2,
  imageUrl: '/img/NotFoundImg.jpg',
  reviews: [
    { id: 1, author: 'Alice', text: 'Amazing movie!', rate: 10, date: '2023-07-20' },
    { id: 2, author: 'Bob', text: 'Mind-blowing visuals and story.', rate: 9, date: '2023-07-18' },
  ],
};

  function formatDate(dateStr: string) {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  }

export default function FilmPage() {
  const { id } = useParams(); // получаем id из URL (например, /film/1)

  const film = mockFilm; 

  const isLoggedIn = true;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{film.title}</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={film.imageUrl}
          alt={film.title}
          className="w-full md:w-1/3 rounded-lg shadow-md"
        />

         {!isLoggedIn && (
            <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded">
              <p className="mb-2 text-yellow-800 font-medium">
                Чтобы оставить отзыв, пожалуйста, <Link to="/login" className="underline text-blue-600">войдите</Link> или <Link to="/register" className="underline text-blue-600">зарегистрируйтесь</Link>.
              </p>
            </div>
          )}

          {isLoggedIn && (
            <button className="h-1/2 mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Оставить отзыв
            </button>
          )}

        <div>
          <p className="text-xl mb-4">⭐ {film.rating.toFixed(1)} / 10</p>
          <h2 className="text-2xl font-semibold mb-2">Отзывы:</h2>
          <ul className="space-y-4">
            {film.reviews.map((review) => (
              <li key={review.id} className="border-b pb-4">
                <div className="flex justify-between items-center mb-1">
                  <strong>{review.author}</strong>
                  <span className="text-sm text-gray-600">{formatDate(review.date)}</span>
                </div>
                <p className="mb-1">Оценка: <span className="font-semibold">{review.rate} / 10</span></p>
                <p>{review.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
