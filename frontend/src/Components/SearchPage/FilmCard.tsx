import { useNavigate } from "react-router-dom";
import { FilmGet } from "../../Models/Film";
import { useAuth } from "../../Context/useAuth";
import { deleteFilmApi } from "../../Services/FilmService";
import { toast } from "react-toastify";
import { useState } from "react";
import { createPortal } from "react-dom";
import EditFilm from "../EditFilm";

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
    if (window.confirm("Are you sure?")) {
      await deleteFilmApi(film.id).catch(() => {
        toast.warning("Unexpected error");
      });
      getFilms();
    }
  };

  return (
    <>
      {/* Portal: render modal outside the card */}
      {showEditForm &&
        createPortal(
          <EditFilm
            filmId={film.id}
            initialFilm={{
              title: film.title,
              filmType: film.filmType,
              imageUrl: film.imageUrl,
              filmCategory: film.filmCategory,
            }}
            onClose={() => setShowEditForm(false)}
            onSuccess={getFilms}
          />,
          document.body,
        )}

      <div
        className="relative group w-40 md:w-48 lg:w-full aspect-[2/3] cursor-pointer rounded-xl overflow-visible transition-transform duration-200 hover:scale-105"
        onClick={() => navigate(`/film/${film.id}`)}
      >
        {/* Image container with rounded corners and shadow */}
        <div className="relative h-full w-full rounded-xl overflow-hidden shadow-md">
          <img
            src={film.imageUrl}
            alt={film.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = blankSrc;
            }}
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center text-white p-3">
            <h3 className="text-base md:text-lg font-bold text-center leading-tight line-clamp-2 mb-1">
              {film.title}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="font-semibold">{film.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-300">/ 10</span>
            </div>
            <p className="text-xs mt-1">{film.reviews?.length || 0} reviews</p>

            {user?.role.includes("Admin") && (
              <div className="absolute top-3 right-2 flex gap-2">
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-2 py-1 rounded-md transition"
                >
                  Edit
                </button>
                <button
                  onClick={deleteFilm}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-2 py-1 rounded-md transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
