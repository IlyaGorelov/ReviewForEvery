// /src/components/TopListFilmCard.tsx

import { useEffect, useState } from "react";
import { TopListFilmGet } from "../Models/TopListFilm";
import { FilmGet } from "../Models/Film";
import { getFilmByIdApi } from "../Services/FilmService";
import { toast } from "react-toastify";
import { blankSrc } from "./SearchPage/FilmCard";
import { useNavigate } from "react-router-dom";
import { deleteTopFilmApi } from "../Services/TopListFIlmService";

interface Props {
  topListfilm: TopListFilmGet;
  position: number;
  attributes: any;
  listeners: any;
  refNode: (element: HTMLElement | null) => void;
  isDragging: boolean;
  onSuccess: () => void;
}

export default function TopListFilmCard({
  topListfilm,
  position,
  attributes,
  listeners,
  refNode,
  isDragging,
  onSuccess,
}: Props) {
  const [film, setFilm] = useState<FilmGet | null>(null);

  async function getFilm() {
    await getFilmByIdApi(topListfilm.filmId)
      .then((res) => {
        if (res?.data) setFilm(res.data);
      })
      .catch((e) => toast.error("Unexpected error"));
  }

  async function deleteTopFilm(e: React.MouseEvent) {
    await deleteTopFilmApi(topListfilm.id)
      .then(() => onSuccess())
      .catch((e) => toast.error("Unexpected error"));
  }

  useEffect(() => {
    getFilm();
  }, []);

  return (
    <div
      ref={refNode}
      {...attributes}
      className={`aspect-[2/3] rounded-lg mb-2 transition ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      <div className="relative group w-full aspect-[2/3]">
        <button
          onClick={deleteTopFilm}
          className="z-50 opacity-0 group-hover:opacity-100 absolute bottom-0 right-0 bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
        >
          Удалить
        </button>
        <img
          src={film?.imageUrl}
          alt={film?.title}
          className="h-full w-full object-cover rounded-lg shadow-md"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = blankSrc;
          }}
        />
        <div
          {...listeners}
          className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center text-white rounded-lg text-center px-2"
        >
          <h3 className="text-lg md:text-3xl font-semibold">{film?.title}</h3>
          {topListfilm.comment && (
            <h3 className="text-lg md:text-xl">{topListfilm.comment}</h3>
          )}
          <p className="text-lg mt-1">⭐ {film?.rating} / 10</p>
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
