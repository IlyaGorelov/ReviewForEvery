import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deleteMyReviewAPI,
  deleteReviewAPI,
  getAllMyReviewsApi,
} from "../../Services/ReviewService";
import { ReviewGet } from "../../Models/Review";
import ReviewCard from "../../Components/ReviewCard";
import { Spinner } from "../../Components/Loader";

const AllMyReviews = () => {
  const [reviews, setReviews] = useState<ReviewGet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await getAllMyReviewsApi();
      if (response?.data) {
        setReviews(response.data);
      }
    } catch (error) {
      toast.error("Не удалось загрузить отзывы");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Ты уверен?")) {
      try {
        await deleteMyReviewAPI(id);
        fetchReviews();
      } catch (error) {
        toast.error("Ошибка при удалении");
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Мои отзывы</h1>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {reviews.length === 0 ? (
            <p className="text-gray-600">
              Вы ещё не оставили ни одного отзыва.
            </p>
          ) : (
            <ul className="space-y-6">
              {reviews.map((review, index) => (
                <li className="flex items-center gap-3" key={review.id}>
                  <ReviewCard
                    index={reviews.length - index}
                    fetchReviews={fetchReviews}
                    review={review}
                    handleDelete={() => handleDelete(review.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default AllMyReviews;
