import React, { useEffect, useState } from "react";
import { ReviewGet } from "../Models/Review";
import { Link, useNavigate } from "react-router-dom";
import { FilmGet } from "../Models/Film";
import { getFilmByIdApi } from "../Services/FilmService";
import { toast } from "react-toastify";
import { formatDate } from "../Pages/FilmPage";
import EditReview from "./EditReview";
import { blankSrc } from "./SearchPage/FilmCard";

type Props = {
  review: ReviewGet;
  handleDelete: (id: number) => void;
};

const ReviewCardForAdminPanel = ({ review, handleDelete }: Props) => {
  const navigate = useNavigate();
  const [film, setFilm] = useState<FilmGet>();

  const getFilm = async () => {
    await getFilmByIdApi(Number(review.filmId))
      .then((res) => {
        if (res?.data) {
          setFilm(res.data);
        }
      })
      .catch((e) => {
        toast.warning("No film found");
      });
  };

  useEffect(() => {
    getFilm();
  }, []);
  return (
    <div>
      <div className="relative flex flex-row-reverse gap-4 items-start">
        {/* Right: image */}
        <img
          src={film?.imageUrl}
          onClick={()=>navigate(`/film/${film?.id}`)}
          alt="Poster"
          className="w-32 aspect-[2/3] object-cover rounded-lg shadow-md"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = blankSrc;
          }}
        />

        {/* Left: info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <Link to={`/film/${film?.id}`} className="text-xl font-semibold mb-1 hover:underline">{film?.title}</Link>
            <p onClick={()=>navigate(`/user/${review.author}`)} className="text-md font-semibold mb-1 hover:underline">Автор: {review.author}</p>
            {review.rate && <p className="mb-1">Оценка: {review.rate} / 10</p>}
            {review.startDate && (
              <p className="mb-1">
                Время:{" "}
                {review.startDate ? formatDate(new Date(review.startDate)) : ""}{" "}
                - {review.endDate ? formatDate(new Date(review.endDate)) : ""}
              </p>
            )}
            {review.countOfSeasons &&<p className="mb-1">Часть: {review.countOfSeasons}</p>}
            <p className="text-gray-700 mb-4">{review.text}</p>
          </div>

          {/* Buttons moved to bottom */}
          <div className="absolute flex flex-col md:flex-row md:gap-4 bottom-0">
            <button
              onClick={() => handleDelete(review.id)}
              className="text-red-600 hover:underline"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCardForAdminPanel;
