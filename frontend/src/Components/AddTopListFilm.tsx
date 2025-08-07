import { useEffect, useState } from "react";
import { FilmGet } from "../Models/Film";
import { getAllFilmsApi } from "../Services/FilmService";
import { toast } from "react-toastify";
import { postTopListFilmApi } from "../Services/TopListFIlmService";
import { useParams } from "react-router-dom";

type Props = {
    position: number;
    onSuccess: ()=>void;
}

export default function AddTopListFilm({position,onSuccess}:Props ) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<string>("");
  const [comment, setComment] = useState("");
  const [films, setFilms] = useState<FilmGet[]>([]);

  const { id } = useParams();

  const fetchFilms = async () => {
    await getAllFilmsApi()
      .then((res) => {
        if (res?.data) setFilms(res.data);
      })
      .catch((e) => toast.error("Unexpected error"));
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const handlePublish = () => {
    if (!selectedFilm) {
      alert("Пожалуйста, выберите фильм");
      return;
    }

    postTopListFilmApi(
      Number(selectedFilm),
      position,
      Number(id),
      comment
    ).then(()=>{
        setShowAddForm(false);
        onSuccess();
    }).catch((e) => toast.error("Unexpected error"));
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setSelectedFilm("");
    setComment("");
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
            <select
              className="w-full border border-gray-400 rounded px-2 py-1 mb-4"
              value={selectedFilm}
              onChange={(e) => setSelectedFilm(e.target.value)}
            >
              <option value="">-- Выберите фильм --</option>
              {films.map((film) => (
                <option key={film.id} value={film.id}>
                  {film.title}
                </option>
              ))}
            </select>

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
