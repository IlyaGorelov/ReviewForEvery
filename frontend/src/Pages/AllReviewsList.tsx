import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteReviewAPI, getAllMyReviewsApi, getAllReviewsApi } from "../Services/ReviewService";
import { ReviewGet } from "../Models/Review";
import ReviewCard from "../Components/ReviewCard";
import ReviewCardForAdminPanel from "../Components/ReviewCardForAdminPanel";

const AllReviewsList = () => {
  const [reviews, setReviews] = useState<ReviewGet[]>([]);

  const fetchReviews = async () => {
    try {
      const response = await getAllReviewsApi();
      if (response?.data) {
        setReviews(response.data);
      }
    } catch (error) {
      toast.error("Не удалось загрузить отзывы");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReviewAPI(id);
      toast.success("Отзыв удалён");
      fetchReviews(); // обновляем список
    } catch (error) {
      toast.error("Ошибка при удалении");
    }
  };

  const colorMap = {
    Completed: "lime-200",
    Dropped: "red-300",
    Backlogged: "gray-300",
    Watching: "orange-300",
  } as const;

  function changeReviewColor(review: ReviewGet): keyof typeof colorMap {
    switch (review.status) {
      case 0:
        return "Completed";
      case 1:
        return "Dropped";
      case 2:
        return "Backlogged";
      case 3:
        return "Watching";
    }
    return "Backlogged";
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Отзывы</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-600">Пользователи ещё не оставили ни одного отзыва.</p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((review) => (
            <li
              key={review.id}
              className={`border rounded p-4 shadow bg-${
                colorMap[changeReviewColor(review)]
              }`}
            >
              <ReviewCardForAdminPanel
                review={review}
                handleDelete={() => handleDelete(review.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllReviewsList;
