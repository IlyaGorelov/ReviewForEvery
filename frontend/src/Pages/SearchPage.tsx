import { useState } from 'react';                         
import FilmCard from '../Components/SearchPage/FilmCard';

const mockFilms = [
  {
    title: 'Inception',                                   
    rating: 9.2,                                         
    reviewsCount: 1200,                                 
    imageUrl: '/img/NotFoundImg.jpg',                     
  },
  {
    title: 'Interstellar',
    rating: 8.7,
    reviewsCount: 950,
    imageUrl: '/img/NotFoundImg.jpg',
  },
  {
    title: 'The Matrix',
    rating: 8.9,
    reviewsCount: 1020,
    imageUrl: '/img/NotFoundImg.jpg',
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');            

  const filteredFilms = mockFilms
    .filter(f => f.title.toLowerCase().includes(query.toLowerCase())) 
    .sort((a, b) => b.reviewsCount - a.reviewsCount);     

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Поиск</h1>
      <input
        type="text"
        placeholder="Введите название ..."
        value={query}                                     
        onChange={e => setQuery(e.target.value)}      
        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Сетка карточек фильмов: 2 на маленьких экранах, 3 — на средних, 4 — на больших */}

        {filteredFilms.map((film, index) => (
          <FilmCard key={index} {...film} />
        ))}
      </div>
    </div>
  );
}
