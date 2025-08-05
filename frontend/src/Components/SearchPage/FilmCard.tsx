import { useNavigate } from "react-router-dom";
import { FilmGet } from "../../Models/Film";
import { useAuth } from "../../Context/useAuth";
import { deleteFilmApi } from "../../Services/FilmService";
import { toast } from "react-toastify";
import { useState } from "react";
import EditFilm from "../EditFilm";
import { title } from "process";

type Props = {
  film: FilmGet;
  getFilms: () => void;
};

export const blankSrc = "/img/NotFoundImg.jpg";

export default function FilmCard({ film, getFilms }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditForm(true);
  };

  const deleteFilm = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteFilmApi(film.id).catch((e) => {
      toast.warning("Unexpected error");
    });
    getFilms();
  };

  return (
    <div
      className="relative group w-40 md:w-48 lg:w-full aspect-[2/3]"
      onClick={() => navigate(`/film/${film.id}`)}
    >
      {showEditForm && (
        <EditFilm
          filmId={film.id}
          initialFilm={{
            title: film.title,
            filmType: film.filmType,
            imageUrl: film.imageUrl,
          }}
          onClose={() => setShowEditForm(false)}
          onSuccess={getFilms}
        />
      )}
      <img
        src={film.imageUrl}
        alt={film.title}
        className="h-full w-full object-cover rounded-lg shadow-md"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = blankSrc;
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center text-white rounded-lg text-center px-2">
        <h3 className="text-lg font-semibold">{film.title}</h3>
        <p className="text-sm mt-1">⭐ {film.rating} / 10</p>
        <p className="text-sm">{film.reviews?.length} отзывов</p>
        {user?.role.includes("Admin") && (
          <>
            <div className="absolute top-2 right-2 hidden group-hover:flex flex-col gap-2">
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
              >
                Редактировать
              </button>
              <button
                onClick={deleteFilm}
                className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
