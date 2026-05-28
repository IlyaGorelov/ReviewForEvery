import { useEffect, useState } from "react";
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

const ReviewsPage = ({ variant, username }: Props) => {
  const [reviews, setReviews] = useState<
    (ReviewGet | ReviewFromOtherUserGet)[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserGet | null>(null);

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, [variant, username, fetchData]);

  // Delete handler – only for "all" and "my" variants
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

  // Compute film indexes only for the "user" variant
  const getFilmIndexes = (reviews: ReviewFromOtherUserGet[]): number[] => {
    const typeToFilmIndexMap = new Map<number, Map<number, number>>();
    const typeCounters = new Map<number, number>();
    const result: number[] = [];

    for (const review of reviews) {
      const type = review.film?.filmCategory || 0;
      const filmId = review.filmId;
      if (!typeToFilmIndexMap.has(type)) {
        typeToFilmIndexMap.set(type, new Map());
        typeCounters.set(type, 1);
      }
      const filmMap = typeToFilmIndexMap.get(type)!;
      let counter = typeCounters.get(type)!;
      if (filmId != null) {
        if (!filmMap.has(filmId)) {
          filmMap.set(filmId, counter);
          typeCounters.set(type, counter + 1);
        }
        result.push(filmMap.get(filmId)!);
      } else {
        result.push(counter);
        typeCounters.set(type, counter + 1);
      }
    }
    return result.reverse();
  };

  const filmIndexes =
    variant === "user"
      ? getFilmIndexes(reviews as ReviewFromOtherUserGet[])
      : [];

  // Derive UI text and settings
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
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <ReviewCard
                  variant={reviewCardVariant}
                  review={review}
                  handleDelete={
                    showDelete ? () => handleDelete(review.id) : undefined
                  }
                  fetchReviews={variant === "my" ? fetchData : undefined}
                  index={
                    variant === "user"
                      ? filmIndexes[index]
                      : variant === "my"
                        ? reviews.length - index
                        : undefined
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
