// src/components/TopListFilmCard.tsx

import { TopListFilmGet } from "../Models/TopListFilm";
import { ReviewGet } from "../Models/Review";
import { toast } from "react-toastify";
import { blankSrc } from "./SearchPage/FilmCard";
import { deleteTopFilmApi } from "../Services/TopListFIlmService";
import { useNavigate } from "react-router-dom";

interface Props {
  topListfilm: TopListFilmGet;
  /** "owner" = editable card (with delete, rating, DnD support), "otherUser" = read‑only */
  variant?: "owner" | "otherUser";
  // DnD props – optional, only needed when variant="owner" and in editing mode
  attributes?: any;
  listeners?: any;
  refNode?: (element: HTMLElement | null) => void;
  isDragging?: boolean;
  onSuccess?: () => void; // only used when variant="owner"
}

export default function TopListFilmCard({
  topListfilm,
  variant = "owner",
  attributes,
  listeners,
  refNode,
  isDragging,
  onSuccess,
}: Props) {
  const navigate = useNavigate();

  // ----- Helpers (owner only) -----
  function getAverage(reviews: ReviewGet[]): number {
    if (!reviews || reviews.length === 0) return 0;
    const validRatings = reviews
      .filter((x) => x.takeInRating)
      .map((x) => x.rate)
      .filter((x): x is number => x != null);
    if (validRatings.length === 0) return 0;
    const sum = validRatings.reduce((a, b) => a + b, 0);
    return sum / validRatings.length;
  }

  async function deleteTopFilm(e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteTopFilmApi(topListfilm.id);
      onSuccess?.();
    } catch {
      toast.error("Could not delete");
    }
  }

  // ----- Position badge styling -----
  const getPositionStyle = (position: number) => {
    if (variant !== "owner")
      return "border border-gray-400 bg-white text-gray-600"; // simple style for otherUser
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-500 to-amber-600 shadow-md text-white";
      case 2:
        return "bg-gradient-to-r from-gray-400 to-gray-500 shadow-md text-white";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-orange-700 shadow-md text-white";
      default:
        return "bg-gradient-to-r from-gray-700 to-gray-800 shadow-md text-white";
    }
  };

  const avgRating = getAverage(topListfilm.film?.reviews || []);
  const hasRating = avgRating > 0;

  return (
    <div
      ref={refNode}
      {...attributes}
      className={`relative rounded-xl shadow-md transition-all duration-200 ${
        variant === "owner" ? "mb-10" : ""
      } ${isDragging ? "opacity-50 scale-95 shadow-xl" : "hover:shadow-xl"}`}
    >
      {/* Image container */}
      <div className="relative group w-full aspect-[2/3] rounded-t-xl overflow-hidden">
        <img
          src={topListfilm.film?.imageUrl}
          alt={topListfilm.film?.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = blankSrc;
          }}
        />

        {/* Hover overlay */}
        <div
          onClick={() =>
            topListfilm.film?.id && navigate(`/film/${topListfilm.film.id}`)
          }
          {...(variant === "owner" ? listeners : {})}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center text-white p-4 ${
            variant === "owner"
              ? "cursor-grab active:cursor-grabbing"
              : "cursor-pointer"
          }`}
        >
          <h3 className="text-lg sm:text-xl font-bold text-center line-clamp-2">
            {topListfilm.film?.title}
          </h3>
          {topListfilm.comment && (
            <p className="text-sm text-gray-200 mt-2 text-center line-clamp-3 italic">
              "{topListfilm.comment}"
            </p>
          )}

          {/* Owner‑only extras */}
          {variant === "owner" && (
            <>
              <div className="mt-3 flex items-center gap-1 bg-white/20 backdrop-blur rounded-full px-3 py-1">
                <span className="text-yellow-300 text-sm">★</span>
                <span className="font-semibold">
                  {hasRating ? avgRating.toFixed(1) : "—"}
                </span>
                <span className="text-xs text-white/80 ml-1">(Me)</span>
              </div>
              {!hasRating && (
                <div className="mt-1 text-xs text-gray-300">No ratings yet</div>
              )}
            </>
          )}
        </div>

        {/* Delete button – only for owner */}
        {variant === "owner" && onSuccess && (
          <button
            onClick={deleteTopFilm}
            className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1.5 shadow-md flex items-center gap-1"
            title="Remove from list"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="text-sm font-medium">Delete</span>
          </button>
        )}
      </div>

      {/* Position indicator */}
      <div
        className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 rounded-full px-4 py-1.5 z-10 whitespace-nowrap font-bold ${getPositionStyle(topListfilm.position)}`}
      >
        <span>{topListfilm.position}</span>
      </div>
    </div>
  );
}
