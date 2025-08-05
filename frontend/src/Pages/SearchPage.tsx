import { useEffect, useState } from "react";
import FilmCard from "../Components/SearchPage/FilmCard";
import { FilmGet } from "../Models/Film";
import { getAllFilmsApi } from "../Services/FilmService";
import { toast } from "react-toastify";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [filmsData, setFilmsData] = useState<FilmGet[] | null>([]);

  const filteredFilms = filmsData?.filter(film =>
    film.title.toLowerCase().includes(query.toLowerCase())
  );

  const getFilms = () => {
    getAllFilmsApi()
      .then((res) => {
        if (res?.data) {
          setFilmsData(res?.data);
        }
      })
      .catch((e) => {
        toast.warning("No films found");
      });
  };

  useEffect(() => {
    getFilms();
  }, []);

  useEffect(() => {
    if (filmsData != null)
      for (let i of filmsData) {
        console.log(i.title);
      }
  }, [filmsData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Поиск</h1>
      <input
        type="text"
        placeholder="Введите название ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Сетка карточек фильмов: 2 на маленьких экранах, 3 — на средних, 4 — на больших */}

        {filmsData === null ? (
          <p>Films not found</p>
        ) : (
          filteredFilms?.map((film, index) => <FilmCard key={index} film={film} getFilms={getFilms}/>)
        )}
      </div>
    </div>
  );
}
