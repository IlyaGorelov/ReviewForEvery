import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deleteMyReviewAPI,
  deleteReviewAPI,
  getAllMyReviewsApi,
} from "../Services/ReviewService";
import { ReviewFromOtherUserGet, ReviewGet } from "../Models/Review";
import ReviewCard from "../Components/ReviewCard";
import { getUserByNameApi } from "../Services/UserService";
import { useParams } from "react-router-dom";
import { UserGet } from "../Models/User";
import ReviewCardForOtherUser from "../Components/ReviewCardForOtherUser";

const AllUserReviews = () => {
  const [reviews, setReviews] = useState<ReviewFromOtherUserGet[]>([]);

  const { username } = useParams();

  const [user, setUser] = useState<UserGet>();

  async function getUser() {
    getUserByNameApi(username!)
      .then((res) => {
        if (res?.data) {setUser(res.data);
          setReviews(res.data.reviews);
        }
      })
      .catch((e) => toast.error("Unexpected error"));
  }


  const getFilmIndexes = (reviews: ReviewFromOtherUserGet[]) => {
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


  const sortedReviews = [...reviews].sort((a, b) => {
    if (a.status === 2 && b.status !== 2) return -1;
    if (a.status !== 2 && b.status === 2) return 1;

    const dateA = new Date(a.startDate!).getTime();
    const dateB = new Date(b.startDate!).getTime();
    return dateB - dateA;
  });

  const filmIndexes = getFilmIndexes(sortedReviews).reverse();

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Отзывы {user?.username}</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-600">{user?.username} не оставил ни одного отзыва.</p>
      ) : (
        <ul className="space-y-6">
          {sortedReviews.map((review, index) => (
            <li className="flex items-center gap-3" key={review.id}>
              <ReviewCardForOtherUser
                index={filmIndexes[index]}
                review={review}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllUserReviews;
