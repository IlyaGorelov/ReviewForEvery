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
  fetchReviews: () => void;
};

const ReviewCard = ({ review, handleDelete, fetchReviews }: Props) => {
  const navigate = useNavigate();
  const [film, setFilm] = useState<FilmGet>();
  const [showForm, setShowForm] = useState(false);

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

  const getStatus = (n: number) => {
    switch (n) {
      case 0:
        return "Завершён";
      case 1:
        return "Брошен";
      case 2:
        return "Отложен";
      case 3:
        return "Смотрю";
    }
  };

  useEffect(() => {
    getFilm();
  }, []);
  return (
    <div>
      {showForm && (
        <>
          <div
            onClick={() => setShowForm(false)}
            className="absolute inset-0 bg-black bg-opacity-50 z-40"
          ></div>
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-5xl p-6  transform -translate-x-1/2 -translate-y-1/2 h-[80%] md:h-[70%] md:max-h-[160vh]">
            <EditReview
              initialReview={{
                rate: review.rate,
                text: review.text,
                status: review.status,
                countOfSeasons: review.countOfSeasons,
                startDate: review.startDate,
                endDate: review.endDate,
              }}
              reviewId={review.id}
              onClose={() => setShowForm(false)}
              onSuccess={fetchReviews}
              hasSeasons={film?.filmType == 1}
            />
          </div>
        </>
      )}

      <div className="relative flex flex-row-reverse gap-4 items-start">
        {/* Right: image */}
        <img
          src={film?.imageUrl}
          onClick={() => navigate(`/film/${film?.id}`)}
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
            <Link
              to={`/film/${film?.id}`}
              className="text-xl font-semibold mb-1"
            >
              {film?.title}
            </Link>
            {review.rate && <p className="mb-1">Оценка: {review.rate} / 10</p>}
            {review.startDate && (
              <p className="mb-1">
                Время:{" "}
                {review.startDate ? formatDate(new Date(review.startDate)) : ""}{" "}
                - {review.endDate ? formatDate(new Date(review.endDate)) : ""}
              </p>
            )}
            <p className="mb-1 font-bold">{getStatus(review.status)}</p>
            {review.countOfSeasons && (
              <p className="mb-1">Часть: {review.countOfSeasons}</p>
            )}
            <p className="text-gray-700 mb-4">{review.text}</p>
          </div>

          {/* Buttons moved to bottom */}
          <div className="flex flex-col md:flex-row md:gap-4 ">
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:underlinetext-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            >
              Редактировать
            </button>
            <button
              onClick={() => handleDelete(review.id)}
              className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
