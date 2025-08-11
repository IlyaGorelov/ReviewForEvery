// src/pages/FilmPage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FilmGet } from "../Models/Film";
import { getFilmByIdApi } from "../Services/FilmService";
import { toast } from "react-toastify";
import { useAuth } from "../Context/useAuth";
import { ReviewGet } from "../Models/Review";
import AddReview from "../Components/AddReview";
import { deleteReviewAPI } from "../Services/ReviewService";
import ReviewsList from "../Components/ReviewsList";
import { blankSrc } from "../Components/SearchPage/FilmCard";

export function formatDate(dateStr: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

export default function FilmPage() {
  const [isFormShowed, setIsFormShowed] = useState(false);
  const [isCreateFormShowed, setIsCreateFormShowed] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();
  const [film, setFilm] = useState<FilmGet | null>(null);
  const { isLoggedIn, user } = useAuth();

  const userReviews = film?.reviews.filter(
    (r: ReviewGet) => r.author === user?.userName
  );

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

  const getFilm = async () => {
    await getFilmByIdApi(Number(id))
      .then((res) => {
        if (res?.data) {
          setFilm(res.data);
        }
      })
      .catch((e) => {
        toast.warning("No film found");
      });
  };

  const deleteReview = async (reviewId: number) => {
    await deleteReviewAPI(reviewId);
    getFilm();
  };

  function getFilmCategory(i: number) {
    switch (i) {
      case 0:
        return "Фильм";
      case 1:
        return "Сериал";
      case 2:
        return "Аниме";
      case 3:
        return "Мультик";
      case 4:
        return "Книга";
    }
  }

  useEffect(() => {
    getFilm();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {isCreateFormShowed && (
        <AddReview
          film={film}
          closeForm={() => setIsCreateFormShowed(false)}
          updateFilm={() => getFilm()}
          hasSeasons={film?.filmType === 1}
        />
      )}

      {isFormShowed && userReviews && (
        <ReviewsList
          reviews={userReviews}
          onClose={() => setIsFormShowed(false)}
          onSuccess={getFilm}
          hasSeasons={film?.filmType === 1}
        />
      )}

      <h1 className="text-3xl font-bold mb-4">{film?.title}</h1>

      <div className="flex flex-row md:flex-row gap-6 mb-8">
        <img
          src={film?.imageUrl}
          alt={film?.title}
          className="w-1/3 md:w-1/3 aspect-[2/3] object-cover rounded-lg shadow-md"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = blankSrc;
          }}
        />

        <div className="flex-1">
          <p className="text-xl mb-4">⭐ {film?.rating.toFixed(1)} / 10</p>
          {!isLoggedIn() && (
            <div className="w-[40%] mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded">
              <p className="mb-2 text-yellow-800 font-medium">
                Чтобы оставить отзыв, пожалуйста,{" "}
                <Link to="/login" className="underline text-blue-600">
                  войдите
                </Link>{" "}
                или{" "}
                <Link to="/register" className="underline text-blue-600">
                  зарегистрируйтесь
                </Link>
                .
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {isLoggedIn() && (
              <>
                <button
                  onClick={() => setIsCreateFormShowed(!isFormShowed)}
                  className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Оставить отзыв
                </button>
                {userReviews && (
                  <button
                    onClick={() => setIsFormShowed(!isFormShowed)}
                    className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Редактировать отзывы
                  </button>
                )}
              </>
            )}
          </div>
          <p className="text-xl mb-4">
            Это {getFilmCategory(Number(film?.filmCategory))}
          </p>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-2">Отзывы:</h2>
        <ul className="space-y-4 ">
          {film?.reviews.map((review: ReviewGet) => (
            <li key={review.id} className="border-b border-t pb-4">
              <div className="flex justify-between items-center mb-1 gap-x-4">
                <Link
                  to={`/user/${review.author}`}
                  className="font-bold text-lg hover:underline"
                >
                  {review.author}
                </Link>

                {user?.role.includes("Admin") && (
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Удалить
                  </button>
                )}

                <span className="text-sm text-gray-600">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              {review.rate && (
                <p className="mb-1">
                  Оценка:{" "}
                  <span className="font-semibold">{review.rate} / 10</span>
                  {!review.takeInRating && (
                    <span className="text-gray-500"> Не учитывается</span>
                  )}
                </p>
              )}

              {review.startDate != null && (
                <p className="mb-1">
                  Время:{" "}
                  <span className="font-semibold">
                    {review.startDate === review.endDate ? (
                      <>
                        {review.startDate &&
                          formatDate(new Date(review.startDate))}
                      </>
                    ) : (
                      <>
                        {review.startDate &&
                          formatDate(new Date(review.startDate))}{" "}
                        -{" "}
                        {review.endDate && formatDate(new Date(review.endDate))}
                      </>
                    )}
                    {(review.countOfHoures || review.countOfMinutes) && (
                      <span className="ml-2 font-semibold border-[2px] border-black p-1">
                        {review.countOfHoures && <>{review.countOfHoures} ч.</>}{" "}
                        {review.countOfMinutes && (
                          <>{review.countOfMinutes} м.</>
                        )}
                      </span>
                    )}
                  </span>
                </p>
              )}

              {review.startDate == null && (
                <p className="mb-1">
                  Время:{" "}
                  <span className="font-semibold border-[2px] border-black p-1">
                    {review.countOfHoures && <>{review.countOfHoures} ч.</>}{" "}
                    {review.countOfMinutes && <>{review.countOfMinutes} м.</>}
                  </span>
                </p>
              )}

              <p className="mb-1">
                Статус:{" "}
                <span className="font-semibold">
                  {getStatus(review.status)}
                </span>
              </p>
              {review.countOfSeasons && (
                <p className="mb-1">
                  Часть:{" "}
                  <span className="font-semibold">{review.countOfSeasons}</span>
                </p>
              )}
              <p>{review.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
