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
  const [selectedReview, setSelectedReview] = useState<ReviewGet | null>(null);

  const handleEditClick = (review: ReviewGet) => {
    setSelectedReview(review);
  };

  const handleEditClose = () => {
    setSelectedReview(null);
  };

  const handleEditSuccess = () => {
    onSuccess();
    setSelectedReview(null);
  };

  return (
    <>
      {/* Reviews List Modal */}
      {!selectedReview && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-7xl p-6 bg-white rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 h-[90%] md:h-[70%] overflow-auto">
            <div className="sticky top-0 bg-white pb-4 z-10 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                My Reviews
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <ul className="mt-4 space-y-4">
              {reviews.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  You don't have any reviews yet.
                </p>
              )}
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="border-b border-gray-100 py-4 flex justify-between items-start gap-4 hover:bg-gray-50 px-2 rounded-lg transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="mb-1 font-semibold text-gray-800">
                      {review.author}
                    </p>
                    <p className="mb-1 text-gray-700 line-clamp-3">
                      {review.text}
                    </p>
                    <p className="text-sm text-gray-500">
                      Rating: {review.rate} / 10 —{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditClick(review)}
                    className="flex-shrink-0 px-4 py-2 bg-gray-800/80 text-white font-medium rounded-xl hover:from-yellow-500 hover:to-orange-500 transition shadow-sm"
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Edit Review Modal - Rendered separately at root level */}
      {selectedReview && (
        <EditReview
          initialReview={{
            rate: selectedReview.rate,
            text: selectedReview.text,
            status: selectedReview.status,
            countOfSeasons: selectedReview.countOfSeasons,
            startDate: selectedReview.startDate,
            takeInRating: selectedReview.takeInRating,
            endDate: selectedReview.endDate,
            countOfHoures: selectedReview.countOfHoures,
            countOfMinutes: selectedReview.countOfMinutes,
          }}
          review={selectedReview}
          reviewId={selectedReview.id}
          onClose={handleEditClose}
          onSuccess={handleEditSuccess}
          hasSeasons={hasSeasons}
        />
      )}
    </>
  );
};

export default ReviewsList;
