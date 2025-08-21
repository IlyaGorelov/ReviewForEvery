import React, { useEffect, useState } from "react";
import { ReviewFromOtherUserGet, ReviewGet } from "../Models/Review";
import { Link, useNavigate } from "react-router-dom";
import { FilmGet } from "../Models/Film";
import { getFilmByIdApi } from "../Services/FilmService";
import { toast } from "react-toastify";
import { formatDate } from "../Pages/FilmPage";
import EditReview from "./EditReview";
import { blankSrc } from "./SearchPage/FilmCard";
import TextWithToggle from "./TextWithToggle";

type Props = {
  review: ReviewFromOtherUserGet;
  index: number;
};

const ReviewCardForOtherUser = ({ review, index }: Props) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  function getFilmCategory(category: number) {
    switch (category) {
      case 0:
        return (
          <span className="p-0.5 ml-5 border-2 border-green-400 text-green-400  items-center text-sm md:text-lg font-medium">
            Фильм
          </span>
        );
      case 1:
        return (
          <span className="p-0.5 ml-5 border-2 border-gray-700 text-black-400  items-center text-sm md:text-lg font-medium">
            Сериал
          </span>
        );
      case 2:
        return (
          <span className="p-0.5 ml-5 border-2 border-orange-400 text-orange-400  items-center text-sm md:text-lg font-medium">
            Аниме
          </span>
        );
      case 3:
        return (
          <span className="p-0.5 ml-5 border-2 border-cyan-400 text-cyan-400  items-center text-sm md:text-lg font-medium">
            Мультик
          </span>
        );
      case 4:
        return (
          <span className="p-0.5 ml-5 border-2 border-pink-400 text-pink-400  items-center text-sm md:text-lg font-medium">
            Книга
          </span>
        );
      case 5:
        return (
          <span className="p-0.5 ml-5 border-2 border-red-400 text-red-400  items-center text-sm md:text-lg font-medium">
            Игра
          </span>
        );
    }
  }

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

  function changeReviewColor(review: ReviewFromOtherUserGet) {
    switch (review.status) {
      case 0:
        return "#D3FFC2";
      case 1:
        return "#FFC2C2";
      case 2:
        return "#DEDEDE";
      case 3:
        return "#FFD59E";
    }
    return "Backlogged";
  }

  return (
    <>
      <div className="-rotate-90 text-lg font-semibold w-6">
        <span className="absolute rotate-90">{index}</span>
        {review.film?.filmCategory != null &&
          getFilmCategory(review.film?.filmCategory)}
      </div>
      <div
        className="border rounded p-4 shadow w-[100%]"
        style={{ backgroundColor: changeReviewColor(review) }}
      >
        <div className="relative flex flex-row-reverse gap-4 items-start">
          {/* Right: image */}
          <img
            src={review.film?.imageUrl}
            onClick={() => navigate(`/film/${review.film?.id}`)}
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
                to={`/film/${review.film?.id}`}
                className="text-xl font-semibold mb-1 hover:underline"
              >
                {review.film?.title}
              </Link>
              {review.rate && (
                <p className="mb-1">
                  Оценка: {review.rate} / 10
                  {!review.takeInRating && (
                    <span className="text-gray-500"> Не учитывается</span>
                  )}
                </p>
              )}

              {review.startDate && (
                <p className="mb-1">
                  Время:{" "}
                  {review.startDate === review.endDate ? (
                    <>
                      {review.startDate &&
                        formatDate(new Date(review.startDate))}
                    </>
                  ) : (
                    <>
                      {review.startDate &&
                        formatDate(new Date(review.startDate))}{" "}
                      - {review.endDate && formatDate(new Date(review.endDate))}
                    </>
                  )}
                  {(review.countOfHoures || review.countOfMinutes) && (
                    <span className="ml-2 font-semibold border-[2px] border-black p-1">
                      {review.countOfHoures && <>{review.countOfHoures} ч.</>}{" "}
                      {review.countOfMinutes && <>{review.countOfMinutes} м.</>}
                    </span>
                  )}
                </p>
              )}

              {!review.startDate && (
                <p className="mb-1">
                  Время:{" "}
                  <span className="font-semibold border-[2px] border-black p-1">
                    {review.countOfHoures && <>{review.countOfHoures} ч.</>}{" "}
                    {review.countOfMinutes && <>{review.countOfMinutes} м.</>}
                  </span>
                </p>
              )}

              <p className="mb-1 font-bold">{getStatus(review.status)}</p>
              {review.countOfSeasons && (
                <p className="mb-1">Часть: {review.countOfSeasons}</p>
              )}
              <p className="text-gray-700 mb-4"><TextWithToggle text={review.text}/></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewCardForOtherUser;
