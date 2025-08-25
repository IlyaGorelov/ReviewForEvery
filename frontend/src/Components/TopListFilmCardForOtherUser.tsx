// /src/components/TopListFilmCard.tsx

import { useEffect, useState } from "react";
import { TopListFilmGet } from "../Models/TopListFilm";
import { FilmGet } from "../Models/Film";
import { getFilmByIdApi } from "../Services/FilmService";
import { toast } from "react-toastify";
import { blankSrc } from "./SearchPage/FilmCard";
import { useNavigate } from "react-router-dom";

interface Props {
  topListfilm: TopListFilmGet;
  position: number;
}

export default function TopListFilmCardForOtherUser({
  topListfilm,
  position,
}: Props) {
  const [film, setFilm] = useState<FilmGet | null>(null);
  const navigate = useNavigate();
  async function getFilm() {
    await getFilmByIdApi(topListfilm.filmId)
      .then((res) => {
        if (res?.data) setFilm(res.data);
      })
      .catch((e) => toast.error("Unexpected error"));
  }

  useEffect(() => {
    getFilm();
  }, []);

  return (
    <div className="aspect-[2/3] rounded-lg mb-2 transition">
      <div className="relative group w-full aspect-[2/3]">
        <img
          src={topListfilm.film.imageUrl}
          alt={topListfilm.film.title}
          className="h-full w-full object-cover rounded-lg shadow-md"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = blankSrc;
          }}
        />
        <div
          onClick={() => navigate(`/film/${topListfilm.film.id}`)}
          className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center text-white rounded-lg text-center px-2"
        >
          <h3 className="text-lg md:text-3xl font-semibold">{topListfilm.film.title}</h3>
          {topListfilm.comment && (
            <h3 className="text-lg md:text-xl">{topListfilm.comment}</h3>
          )}
        
        </div>
      </div>
      <div className="mt-2 flex justify-center">
        <div className="border border-gray-400 rounded-lg px-3 py-1 text-sm text-gray-600 font-medium shadow-sm bg-white">
          {position}
        </div>
      </div>
    </div>
  );
}
