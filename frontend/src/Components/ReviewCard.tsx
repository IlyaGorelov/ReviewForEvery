import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ReviewGet, ReviewFromOtherUserGet } from "../Models/Review";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../Pages/FilmPage";
import EditReview from "./EditReview";
import { blankSrc } from "./SearchPage/FilmCard";
import TextWithToggle from "./TextWithToggle";
import { FilmForReviewGet } from "../Models/Film";
import { getFilmByIdApi } from "../Services/FilmService";
import { toast } from "react-toastify";

type Props = {
  review: ReviewGet | ReviewFromOtherUserGet;
  handleDelete?: (id: number) => void;
  variant?: "default" | "admin" | "otherUser";
  fetchReviews?: () => void;
  index?: number;
};

const ReviewCard = ({
  review,
  handleDelete,
  variant = "default",
  fetchReviews,
  index,
}: Props) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [film, setFilm] = useState<FilmForReviewGet | undefined>(
    (review as any).film || undefined,
  );

  useEffect(() => {
    if (
      variant === "admin" &&
      !(review as any).film &&
      (review as any).filmId
    ) {
      getFilmByIdApi(Number((review as any).filmId))
        .then((res) => {
          if (res?.data) setFilm(res.data);
        })
        .catch(() => toast.warning("No film found"));
    }
  }, [variant, review]);

  const getFilmCategoryBadge = (category: number) => {
    const config: Record<number, { label: string; color: string }> = {
      0: { label: "Movie", color: "green" },
      1: { label: "Series", color: "gray" },
      2: { label: "Anime", color: "orange" },
      3: { label: "Cartoon", color: "cyan" },
      4: { label: "Book", color: "pink" },
      5: { label: "Game", color: "red" },
    };
    const { label, color } = config[category] || {
      label: "Unknown",
      color: "gray",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border-2 border-${color}-400 text-${color}-600 bg-${color}-50`}
      >
        {label}
      </span>
    );
  };

  const getStatusText = (status: number) =>
    ["Completed", "Abandoned", "Backlogged", "In progress"][status] ??
    "Unknown";

  const getStatusColor = (status: number) => {
    const colors = [
      "bg-green-100 border-green-300 text-green-800",
      "bg-red-100 border-red-300 text-red-800",
      "bg-gray-100 border-gray-300 text-gray-600",
      "bg-amber-100 border-amber-300 text-amber-800",
    ];
    return colors[status] ?? "bg-gray-100 border-gray-300 text-gray-600";
  };

  // Background / border styling for different variants
  const getCardStyle = (status: number) => {
    const gradients = [
      "bg-gradient-to-br from-green-50 to-emerald-50",
      "bg-gradient-to-br from-red-50 to-rose-50",
      "bg-gradient-to-br from-gray-50 to-slate-50",
      "bg-gradient-to-br from-amber-50 to-yellow-50",
    ];
    return `rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden ${gradients[status] ?? "bg-white"}`;
  };

  const filmData = film;

  // ---------- Outer structure (index badge + card) ----------
  const renderContent = () => {
    const card = (
      <div className={getCardStyle(review.status)}>
        <div className="p-5 flex flex-col md:flex-row gap-5">
          {/* Poster image */}
          <div
            className={`flex-shrink-0 ${variant === "otherUser" ? "md:ml-4" : ""}`}
          >
            <img
              src={filmData?.imageUrl}
              onClick={() => filmData?.id && navigate(`/film/${filmData.id}`)}
              alt="Poster"
              className={`w-32 md:w-36 aspect-[2/3] object-cover cursor-pointer hover:scale-105 transition-transform duration-200 ${
                variant === "otherUser"
                  ? "rounded-lg shadow-md"
                  : "rounded-xl shadow-md"
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = blankSrc;
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col">
            {/* Title + category badge */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Link
                to={`/film/${filmData?.id}`}
                className={`font-bold text-gray-800 hover:text-blue-600 hover:underline transition ${
                  variant === "default" ? "text-2xl" : "text-xl"
                }`}
              >
                {filmData?.title || "Loading..."}
              </Link>
              {(variant === "default" || variant === "otherUser") &&
                filmData?.filmCategory != null &&
                getFilmCategoryBadge(filmData.filmCategory)}
            </div>

            {/* Author link (admin only) */}
            {variant === "admin" && (
              <Link
                to={`/user/${(review as any).author}`}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline mb-3 inline-flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Author: {(review as any).author}
              </Link>
            )}

            {/* Rating */}
            {review.rate && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="font-semibold text-gray-700">
                  {review.rate} / 10
                </span>
                {(variant === "default" || variant === "otherUser") &&
                  !review.takeInRating && (
                    <span className="text-sm text-gray-400 italic">
                      (Not counted)
                    </span>
                  )}
              </div>
            )}

            {/* Date & duration */}
            {variant === "default" &&
              (review.startDate ||
                review.countOfHoures ||
                review.countOfMinutes) && (
                <div className="mb-2 text-sm text-gray-600">
                  <span className="font-medium">When:</span>{" "}
                  {review.startDate &&
                  review.endDate &&
                  review.startDate !== review.endDate
                    ? `${formatDate(new Date(review.startDate))} — ${formatDate(new Date(review.endDate))}`
                    : review.startDate
                      ? formatDate(new Date(review.startDate))
                      : "Not specified"}
                  {(review.countOfHoures || review.countOfMinutes) && (
                    <span className="ml-3 inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium">
                      ⏱ {review.countOfHoures && `${review.countOfHoures}h`}{" "}
                      {review.countOfMinutes && `${review.countOfMinutes}m`}
                    </span>
                  )}
                </div>
              )}

            {variant === "admin" && review.startDate && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Period:</span>{" "}
                {review.startDate === review.endDate
                  ? formatDate(new Date(review.startDate))
                  : `${formatDate(new Date(review.startDate))} — ${
                      review.endDate
                        ? formatDate(new Date(review.endDate))
                        : "…"
                    }`}
              </p>
            )}

            {variant === "otherUser" && (
              <>
                {review.startDate && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Period:</span>{" "}
                    {review.startDate === review.endDate
                      ? formatDate(new Date(review.startDate))
                      : `${formatDate(new Date(review.startDate))} — ${
                          review.endDate
                            ? formatDate(new Date(review.endDate))
                            : "…"
                        }`}
                    {(review.countOfHoures || review.countOfMinutes) && (
                      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium">
                        ⏱ {review.countOfHoures && `${review.countOfHoures}h`}{" "}
                        {review.countOfMinutes && `${review.countOfMinutes}m`}
                      </span>
                    )}
                  </p>
                )}
                {!review.startDate &&
                  (review.countOfHoures || review.countOfMinutes) && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Duration:</span>{" "}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium">
                        ⏱ {review.countOfHoures && `${review.countOfHoures}h`}{" "}
                        {review.countOfMinutes && `${review.countOfMinutes}m`}
                      </span>
                    </p>
                  )}
              </>
            )}

            {/* Status badge */}
            <div className="mb-3">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  variant === "otherUser"
                    ? "border"
                    : `border ${getStatusColor(review.status)}`
                }`}
              >
                {getStatusText(review.status)}
              </span>
            </div>

            {/* Season / Part */}
            {review.countOfSeasons && (
              <p className="text-sm text-gray-500 mb-2">
                Part: {review.countOfSeasons}
              </p>
            )}

            {/* Review text */}
            <div className="text-gray-700 mb-4">
              <TextWithToggle text={review.text} />
            </div>

            {/* Buttons (only for default & admin) */}
            {(variant === "default" || variant === "admin") && (
              <div className="flex flex-wrap gap-3 mt-auto pt-2">
                {variant === "default" && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete?.(review.id)}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    variant === "admin"
                      ? "text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-200 gap-2"
                      : "bg-white border border-red-500 text-red-600 hover:bg-red-50 hover:shadow-sm"
                  }`}
                >
                  {variant === "admin" && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    // Layout wrappers for different variants
    if (variant === "otherUser") {
      return (
        <div className="relative flex flex-col sm:flex-row items-start gap-2">
          {/* Index badge (like original otherUser style) */}
          <div className="relative flex flex-col items-center sm:block sm:w-12">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 transform rotate-90 origin-center sm:static sm:rotate-0">
              <span className="text-lg font-bold text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm">
                #{index}
              </span>
            </div>
          </div>
          {/* Card with reverse flex for poster on right */}
          {card}
        </div>
      );
    }

    if (variant === "default" && index !== undefined) {
      return (
        <>
          <div className="relative flex flex-col items-center">
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 transform rotate-90 origin-center">
              <span className="text-lg font-bold text-gray-400">{index}</span>
            </div>
          </div>
          {card}
        </>
      );
    }

    // Admin or default without index
    return card;
  };

  return (
    <>
      {renderContent()}

      {variant === "default" &&
        showForm &&
        filmData &&
        createPortal(
          <EditReview
            initialReview={{
              rate: review.rate,
              text: review.text,
              status: review.status,
              countOfSeasons: review.countOfSeasons,
              startDate: review.startDate,
              takeInRating: review.takeInRating,
              countOfHoures: review.countOfHoures,
              countOfMinutes: review.countOfMinutes,
              endDate: review.endDate,
            }}
            review={review as ReviewGet}
            reviewId={review.id}
            onClose={() => setShowForm(false)}
            onSuccess={fetchReviews || (() => {})}
            hasSeasons={filmData.filmType === 1}
          />,
          document.body,
        )}
    </>
  );
};

export default ReviewCard;
