import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteReviewAPI, getAllReviewsApi } from "../Services/ReviewService";
import { ReviewGet } from "../Models/Review";
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
    if (window.confirm("Ты уверен?")) {
      try {
        await deleteReviewAPI(id);
        toast.success("Отзыв удалён");
        fetchReviews(); // обновляем список
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
      <h1 className="text-3xl font-bold mb-6">Отзывы</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-600">
          Пользователи ещё не оставили ни одного отзыва.
        </p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((review) => (
            <li key={review.id}>
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
