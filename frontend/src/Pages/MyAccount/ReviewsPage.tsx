import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"; // NEW: useMemo, useRef
import { toast } from "react-toastify";
import { ReviewGet, ReviewFromOtherUserGet } from "../../Models/Review";
import {
  deleteMyReviewAPI,
  deleteReviewAPI,
  getAllMyReviewsApi,
  getAllReviewsApi,
} from "../../Services/ReviewService";
import { getUserByNameApi } from "../../Services/UserService";
import { UserGet } from "../../Models/User";
import { Spinner } from "../../Components/Loader";
import ReviewCard from "../../Components/ReviewCard";

type Props = {
  variant: "all" | "my" | "user";
  username?: string;
};

type ReviewLine = {
  reviewId: number;
  overlapId: number;
  top: number;
  bottom: number;
  height: number;
  track: number;
};

// --- Helper to get a display name for a review (any variant) ---
const getReviewName = (review: ReviewGet | ReviewFromOtherUserGet): string => {
  // Try film name from nested object (user variant)
  if ("film" in review && review.film?.title) {
    return review.film.title;
  }
  // Fallback fields that might exist
  if ("filmName" in review && (review as any).filmName) {
    return (review as any).filmName;
  }
  if ("movieTitle" in review && (review as any).movieTitle) {
    return (review as any).movieTitle;
  }
  return `Review #${review.id}`;
};

const computeOverlaps = (
  reviews: (ReviewGet | ReviewFromOtherUserGet)[],
): Map<number, { id: number; name: string }[]> => {
  const now = new Date();

  const processed = reviews
    .filter((r) => r.startDate != null)
    .map((r) => {
      const start = new Date(r.startDate!);
      const end = r.endDate ? new Date(r.endDate) : now;
      return { ...r, _start: start, _end: end };
    });

  const map = new Map<number, { id: number; name: string }[]>();
  processed.forEach((r) => map.set(r.id, []));

  for (let i = 0; i < processed.length; i++) {
    const reviewI = processed[i];
    for (let j = i + 1; j < processed.length; j++) {
      const reviewJ = processed[j];

      if (
        reviewI._start.getTime() === reviewJ._start.getTime() &&
        reviewI._end.getTime() === reviewJ._end.getTime()
      )
        continue;

      if (reviewJ._start.getTime() === reviewJ._end.getTime()) continue;

      // Проверка пересечения
      if (reviewI._start <= reviewJ._end && reviewJ._start <= reviewI._end) {
        map
          .get(reviewI.id)!
          .push({ id: reviewJ.id, name: getReviewName(reviewJ) });
      }
    }
  }

  return map;
};

const ReviewsPage = ({ variant, username }: Props) => {
  const [reviews, setReviews] = useState<
    (ReviewGet | ReviewFromOtherUserGet)[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserGet | null>(null);

  const reviewRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const overlapsMap = useMemo(() => computeOverlaps(reviews), [reviews]);

  const [reviewLines, setReviewLines] = useState<ReviewLine[]>([]);

  const scrollToReview = (id: number) => {
    const el = reviewRefs.current.get(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (variant === "all") {
        const response = await getAllReviewsApi();
        if (response?.data) setReviews(response.data);
      } else if (variant === "my") {
        const response = await getAllMyReviewsApi();
        if (response?.data) setReviews(response.data);
      } else if (variant === "user" && username) {
        const response = await getUserByNameApi(username);
        if (response?.data) {
          setUser(response.data);
          setReviews(response.data.reviews || []);
        }
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [variant, username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useLayoutEffect(() => {
    const rawLines: Omit<ReviewLine, "track">[] = [];

    reviews.forEach((review) => {
      const overlaps = overlapsMap.get(review.id) || [];

      overlaps.forEach((overlap) => {
        const startEl = reviewRefs.current.get(review.id);
        const endEl = reviewRefs.current.get(overlap.id);

        if (!startEl || !endEl) return;

        const top = Math.min(startEl.offsetTop, endEl.offsetTop);

        const bottom = Math.max(
          startEl.offsetTop + startEl.offsetHeight,
          endEl.offsetTop + endEl.offsetHeight,
        );

        rawLines.push({
          reviewId: review.id,
          overlapId: overlap.id,
          top,
          bottom,
          height: bottom - top,
        });
      });
    });

    const uniqueLines = new Map<string, Omit<ReviewLine, "track">>();

    rawLines.forEach((line) => {
      if (!uniqueLines.has(String(line.overlapId))) {
        uniqueLines.set(String(line.overlapId), line);
      }
    });

    const filteredLines = Array.from(uniqueLines.values());

    filteredLines.sort((a, b) => a.top - b.top);

    const trackEnds: number[] = [];

    const lines: ReviewLine[] = filteredLines.map((line) => {
      let track = 0;

      while (track < trackEnds.length && line.top <= trackEnds[track]) {
        track++;
      }

      trackEnds[track] = line.bottom;

      return {
        ...line,
        track,
      };
    });

    setReviewLines(lines);
  }, [reviews, overlapsMap]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure?")) {
      try {
        if (variant === "all") {
          await deleteReviewAPI(id);
        } else if (variant === "my") {
          await deleteMyReviewAPI(id);
        }
        toast.success("Review deleted");
        fetchData();
      } catch (error) {
        toast.error("Error while deleting");
      }
    }
  };

  const title =
    variant === "all"
      ? "All Reviews"
      : variant === "my"
        ? "My Reviews"
        : `Reviews by ${user?.username || username}`;

  const subtitle =
    variant === "all"
      ? "Manage user reviews"
      : variant === "my"
        ? "Your personal reviews"
        : "All reviews from this user";

  const emptyMessage =
    variant === "all"
      ? "Users haven't left any reviews so far."
      : variant === "my"
        ? "You haven't left any reviews yet."
        : `${user?.username || "This user"} hasn't left any reviews yet.`;

  const showDelete = variant === "all" || variant === "my";
  const reviewCardVariant =
    variant === "user" ? "otherUser" : variant === "all" ? "admin" : "default";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="pb-2 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto sm:mx-0"></div>
          <p className="mt-4 text-gray-500 text-lg">{subtitle}</p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center transition-all hover:shadow-lg">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">{emptyMessage}</p>
            {variant === "my" && (
              <button
                onClick={() => (window.location.href = "/search")}
                className="mt-6 inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
              >
                Explore movies to review
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6 relative">
            {reviewLines.map((line) => {
              const overlap = overlapsMap
                .get(line.reviewId)
                ?.find((o) => o.id === line.overlapId);

              return (
                <div
                  key={`${line.reviewId}-${line.overlapId}`}
                  className="absolute pointer-events-none"
                  style={{
                    right: `${-20 - line.track * 28}px`,
                    top: line.top,
                    height: line.height,
                    width: "4px",
                  }}
                >
                  {/* линия */}
                  <div className="absolute h-full w-full bg-blue-500 rounded-full" />

                  {/* подпись */}
                  {overlap && (
                    <button
                      onClick={() => scrollToReview(overlap.id)}
                      className="
                          sticky
                          top-1/2 
                          left-1/2
                          -translate-x-1/2
                          -translate-y-1/2
                          rotate-90
                          pointer-events-auto
                          whitespace-nowrap
                          bg-blue-100
                          text-blue-800
                          text-xs
                          font-medium
                          px-2
                          py-1
                          rounded-full
                          shadow-sm
                          hover:bg-blue-200
                        "
                    >
                      {overlap.name}
                    </button>
                  )}
                </div>
              );
            })}

            {reviews.map((review, index) => {
              return (
                <div
                  key={review.id}
                  ref={(el) => {
                    // NEW: Store ref for each review container
                    if (el) reviewRefs.current.set(review.id, el);
                    else reviewRefs.current.delete(review.id);
                  }}
                  className="transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* NEW: Flex row to place card and overlap indicator */}
                  <div className="flex items-start">
                    {/* Card takes remaining space */}
                    <div className="flex-1 min-w-0 ml-1">
                      <ReviewCard
                        variant={reviewCardVariant}
                        review={review}
                        handleDelete={
                          showDelete ? () => handleDelete(review.id) : undefined
                        }
                        fetchReviews={variant === "my" ? fetchData : undefined}
                        index={
                          variant === "user"
                            ? index
                            : variant === "my"
                              ? reviews.length - index
                              : undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
