import { useEffect, useState } from "react";
import { FilmGet } from "../Models/Film";
import { getAllFilmsApi } from "../Services/FilmService";
import { toast } from "react-toastify";
import { postTopListFilmApi } from "../Services/TopListFIlmService";
import { useParams } from "react-router-dom";

type Props = {
  onSuccess: () => void;
};

export default function AddTopListFilm({ onSuccess }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<number>();
  const [comment, setComment] = useState("");
  const [films, setFilms] = useState<FilmGet[]>([]);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<number>(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { id } = useParams();


  const fetchFilms = async () => {
    await getAllFilmsApi(1,20,query)
      .then((res) => {
        if (res?.data) setFilms(res.data.items);
      })
      .catch((e) => toast.error("Unexpected error"));
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  useEffect(() => {
    fetchFilms();
  }, [query]);

  const handlePublish = () => {
    if (!selectedFilm) {
      alert("Пожалуйста, выберите фильм");
      return;
    }

    postTopListFilmApi(selectedFilm, position, Number(id), comment)
      .then(() => {
        setShowAddForm(false);
        onSuccess();
      })
      .catch((e) => toast.error("Unexpected error"));
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setSelectedFilm(0);
    setComment("");
  };

  const handleSelect = (film: FilmGet) => {
    setSelectedFilm(film.id);
    setQuery(film.title);
    setShowSuggestions(false);
  };

  return (
    <div className="relative group w-full aspect-[2/3]">
      {!showAddForm && (
        <>
          <img
            src="/img/Plus.png"
            alt="Add Film"
            className="h-full w-full object-cover border-[10px] border-gray-300 border-dashed rounded-lg shadow-md"
          />
          <div
            onClick={() => setShowAddForm(true)}
            className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center text-white rounded-lg text-center px-2"
          ></div>
        </>
      )}

      {showAddForm && (
        <div className="absolute inset-0 bg-white p-4 rounded-lg flex flex-col justify-between">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Выберите фильм:
            </label>

            <input
              type="text"
              placeholder="Название"
              className="w-full border border-gray-400 rounded px-2 py-1"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              onFocus={() => setShowSuggestions(true)}
            />

            {showSuggestions && query && films.length > 0 && (
              <ul className="absolute w-full border border-gray-400 rounded-b bg-white max-h-40 overflow-y-auto z-10">
                {films.map((film) => (
                  <li
                    key={film.id}
                    className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                    onMouseDown={() => handleSelect(film)}
                  >
                    {film.title}
                  </li>
                ))}
              </ul>
            )}

            <label className="block text-sm mb-2 font-semibold text-gray-700">
              Позиция:
            </label>
            <input
              className="w-full border border-gray-400 rounded px-2 py-1 mb-4 resize-none"
              value={position}
              type="number"
              onChange={(e) => setPosition(Number(e.target.value))}
              placeholder="Введите позицию..."
              
            />

            <label className="block text-sm mb-2 font-semibold text-gray-700">
              Комментарий (если нужно):
            </label>
            <textarea
              className="w-full border border-gray-400 rounded px-2 py-1 mb-4 resize-none"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Введите комментарий..."
            />
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={handlePublish}
            type="button"
          >
            Опубликовать
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            onClick={handleCancel}
            type="button"
          >
            Отмена
          </button>
        </div>
      )}
    </div>
  );
}
