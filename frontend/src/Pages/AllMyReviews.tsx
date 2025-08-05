import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteReviewAPI, getAllMyReviewsApi } from "../Services/ReviewService";
import { ReviewGet } from "../Models/Review";
import { FilmGet } from "../Models/Film";
import { getFilmByIdApi } from "../Services/FilmService";
import ReviewCard from "../Components/ReviewCard";

const AllMyReviews = () => {
  const [reviews, setReviews] = useState<ReviewGet[]>([]);
  const [film,setFilm] = useState<FilmGet>();
  const navigate = useNavigate();

 const sortedReviews = [...reviews].sort((a, b) =>
  new Date(b.startDate!).getTime() - new Date(a.startDate!).getTime()
);

  const getFilmTitle = async (id:number)=>{
        await getFilmByIdApi(id)
        .then((res) => {
          if (res?.data) {
            setFilm(res.data);
          }
        })
        .catch((e) => {
            toast.warning("No film found");
        });
        return film?.title;
  }

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
      await deleteReviewAPI(id);
      toast.success("Отзыв удалён");
      fetchReviews(); // обновляем список
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
          {sortedReviews.map((review) => (
            
            <li key={review.id} className="border rounded p-4 shadow">
              <ReviewCard review={review} handleDelete={()=>handleDelete(review.id)}/>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllMyReviews;
