import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deleteMyReviewAPI,
  deleteReviewAPI,
  getAllMyReviewsApi,
} from "../../Services/ReviewService";
import { ReviewGet } from "../../Models/Review";
import ReviewCard from "../../Components/ReviewCard";

const AllMyReviews = () => {
  const [reviews, setReviews] = useState<ReviewGet[]>([]);

  const getFilmIndexes = (reviews: ReviewGet[]) => {
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
        // Без filmId – просто используем текущий счётчик для типа
        result.push(counter);
        typeCounters.set(type, counter + 1);
      }
    }

    return result;
  };

  function sortByCreatedDate(a: ReviewGet, b: ReviewGet) {
    const createDateA = new Date(a.createdAt!).getTime();
    const createDateB = new Date(b.createdAt!).getTime();

    console.log(`Created Date of 1 ${a.film.title} is ${a.createdAt}`);
    console.log(`Created Date of 2 ${b.film.title} is ${b.createdAt}`);
    return  createDateB-createDateA;
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    if (a.status === 2 && b.status !== 2) return -1;
    if (a.status !== 2 && b.status === 2) return 1;

    if (a.startDate === b.startDate) {
      sortByCreatedDate(a,b)
    }

    const dateA = new Date(a.startDate!).getTime();
    const dateB = new Date(b.startDate!).getTime();
    return dateB - dateA;
  });

  const filmIndexes = getFilmIndexes(sortedReviews).reverse();

  const fetchReviews = async () => {
    try {
      const response = await getAllMyReviewsApi();
      if (response?.data) {
        setReviews(response.data);
      }
    } catch (error) {
      toast.error("Не удалось загрузить отзывы");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMyReviewAPI(id);
      fetchReviews();
    } catch (error) {
      toast.error("Ошибка при удалении");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Мои отзывы</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-600">Вы ещё не оставили ни одного отзыва.</p>
      ) : (
        <ul className="space-y-6">
          {sortedReviews.map((review, index) => (
            <li className="flex items-center gap-3" key={review.id}>
              <ReviewCard
                index={filmIndexes[index]}
                fetchReviews={fetchReviews}
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

export default AllMyReviews;
