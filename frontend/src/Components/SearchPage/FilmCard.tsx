import { useNavigate } from "react-router-dom";
import { FilmGet } from "../../Models/Film";
import image from "/img/NotFoundImg.jpg"

type Props = {
  film: FilmGet
}

export default function FilmCard({film}:Props) {
  const navigate = useNavigate();
  return (
    <div className="relative group w-40 md:w-48 lg:w-56"
    onClick={() => navigate(`/film/${film.id}`)}
    >
      <img
        src={film.imageUrl}
        alt={film.title}
        className="w-full h-auto rounded-lg shadow-md"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center text-white rounded-lg text-center px-2">
        <h3 className="text-lg font-semibold">{film.title}</h3>
        <p className="text-sm mt-1">⭐ {film.rating} / 10</p>
        <p className="text-sm">{film.reviews?.length} отзывов</p>
      </div>
    </div>
  );
}
