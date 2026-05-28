// src/pages/FilmPage.tsx
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FilmGet } from "../Models/Film";
import { getFilmByIdApi } from "../Services/FilmService";
import { toast } from "react-toastify";
import { useAuth } from "../Context/useAuth";
import { ReviewGet } from "../Models/Review";
import AddReview from "../Components/AddReview";
import { deleteReviewAPI } from "../Services/ReviewService";
import ReviewsList from "../Components/ReviewsList";
import { blankSrc } from "../Components/SearchPage/FilmCard";
import TextWithToggle from "../Components/TextWithToggle";

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

  const { id } = useParams();
  const [film, setFilm] = useState<FilmGet | null>(null);
  const { isLoggedIn, user } = useAuth();

  const userReviews = film?.reviews.filter(
    (r: ReviewGet) => r.author === user?.userName,
  );

  const getStatus = (n: number) => {
    switch (n) {
      case 0:
        return "Completed";
      case 1:
        return "Abandoned";
      case 2:
        return "Backlogged";
      case 3:
        return "In progress";
      default:
        return "Unknown";
    }
  };

  const getFilm = useCallback(async () => {
    await getFilmByIdApi(Number(id))
      .then((res) => {
        if (res?.data) {
          setFilm(res.data);
        }
      })
      .catch(() => {
        toast.warning("No film found");
      });
  }, [id]);

  const deleteReview = async (reviewId: number) => {
    if (window.confirm("Are you sure?")) {
      await deleteReviewAPI(reviewId);
      getFilm();
    }
  };

  function getFilmCategory(i: number) {
    switch (i) {
      case 0:
        return "Movie";
      case 1:
        return "Series";
      case 2:
        return "Anime";
      case 3:
        return "Cartoon";
      case 4:
        return "Book";
      case 5:
        return "Game";
      default:
        return "Unknown";
    }
  }

  useEffect(() => {
    getFilm();
  }, [getFilm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Modals */}
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

        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
              {film?.title}
            </h1>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Poster */}
              <div className="w-full md:w-1/3 lg:w-1/4">
                <img
                  src={film?.imageUrl}
                  alt={film?.title}
                  className="w-full aspect-[2/3] object-cover rounded-xl shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = blankSrc;
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">⭐</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {film?.rating.toFixed(1)} / 10
                  </span>
                </div>

                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Category:</span>{" "}
                  {getFilmCategory(Number(film?.filmCategory))}
                </p>

                {!isLoggedIn() && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-amber-800">
                      To leave a review, please{" "}
                      <Link
                        to="/login"
                        className="underline text-blue-600 hover:text-blue-700"
                      >
                        login
                      </Link>{" "}
                      or{" "}
                      <Link
                        to="/register"
                        className="underline text-blue-600 hover:text-blue-700"
                      >
                        register
                      </Link>
                      .
                    </p>
                  </div>
                )}

                {isLoggedIn() && (
                  <div className="flex flex-wrap gap-4 mb-6">
                    <button
                      onClick={() => setIsCreateFormShowed(true)}
                      className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Review
                    </button>
                    {userReviews && userReviews.length > 0 && (
                      <button
                        onClick={() => setIsFormShowed(true)}
                        className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-sm"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Edit My Reviews
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews section */}
          <div className="border-t border-gray-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Reviews ({film?.reviews.length || 0})
            </h2>

            {film?.reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 text-lg">No reviews yet.</p>
                {isLoggedIn() && (
                  <button
                    onClick={() => setIsCreateFormShowed(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Be the first to review!
                  </button>
                )}
              </div>
            ) : (
              <ul className="space-y-6">
                {film?.reviews.map((review: ReviewGet) => (
                  <li
                    key={review.id}
                    className="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                      <Link
                        to={`/user/${review.author}`}
                        className="text-lg font-semibold text-gray-800 hover:text-blue-600 hover:underline"
                      >
                        {review.author}
                      </Link>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                        {user?.role.includes("Admin") && (
                          <button
                            onClick={() => deleteReview(review.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    {review.rate && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold text-gray-700">
                          {review.rate} / 10
                        </span>
                        {!review.takeInRating && (
                          <span className="text-xs text-gray-400">
                            (Not counted)
                          </span>
                        )}
                      </div>
                    )}

                    {(review.startDate ||
                      review.countOfHoures ||
                      review.countOfMinutes) && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Period:</span>{" "}
                        {review.startDate ? (
                          review.startDate === review.endDate ? (
                            formatDate(new Date(review.startDate))
                          ) : (
                            <>
                              {formatDate(new Date(review.startDate))} —{" "}
                              {review.endDate &&
                                formatDate(new Date(review.endDate))}
                            </>
                          )
                        ) : (
                          "Not specified"
                        )}
                        {(review.countOfHoures || review.countOfMinutes) && (
                          <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 rounded-full text-xs font-medium">
                            ⏱{" "}
                            {review.countOfHoures && `${review.countOfHoures}h`}{" "}
                            {review.countOfMinutes &&
                              `${review.countOfMinutes}m`}
                          </span>
                        )}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Status:</span>{" "}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200">
                        {getStatus(review.status)}
                      </span>
                    </p>

                    {review.countOfSeasons && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Part:</span>{" "}
                        {review.countOfSeasons}
                      </p>
                    )}

                    <div className="text-gray-700 mt-2">
                      <TextWithToggle text={review.text} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
