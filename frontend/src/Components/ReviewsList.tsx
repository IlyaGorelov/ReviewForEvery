import React, { useState } from "react";
import { ReviewGet } from "../Models/Review";
import EditReview from "./EditReview";

type Props = {
  reviews: ReviewGet[];
  onClose: () => void;
  onSuccess: () => void;
  hasSeasons: boolean;
};

const ReviewsList = ({ reviews, onClose, onSuccess, hasSeasons }: Props) => {
  const [showEdit, setShowEdit] = useState(false);
  return (
    <>
      {/* Фон-оверлей */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Модальное окно */}
      <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-5xl p-6 bg-white rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 h-[70%] max-h-[160vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Мои отзывы</h2>
        <ul>
          {reviews.length === 0 && <p>У вас пока нет отзывов.</p>}
          {reviews.map((review) => (
            <>
              {showEdit && (
                <EditReview
                  initialReview={{
                    rate: review.rate,
                    text: review.text,
                    status: review.status,
                    countOfSeasons: review.countOfSeasons,
                    startDate: review.startDate,
                    takeInRating:review.takeInRating,
                    endDate: review.endDate,
                    countOfHoures:review.countOfHoures,
                    countOfMinutes:review.countOfMinutes
                  }}
                  review={review}
                  reviewId={review.id}
                  onClose={() => setShowEdit(false)}
                  onSuccess={onSuccess}
                  hasSeasons={hasSeasons}
                />
              )}
              <li
                key={review.id}
                className="border-b py-2 flex justify-between items-start gap-4"
              >
                <div>
                  <p className="mb-1 font-semibold">{review.author}</p>
                  <p className="mb-1">{review.text}</p>
                  <p className="text-sm text-gray-500">
                    Оценка: {review.rate} / 10 —{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowEdit(true)}
                  className="self-start px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
                >
                  Редактировать
                </button>
              </li>
            </>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Закрыть
        </button>
      </div>
    </>
  );
};

export default ReviewsList;
