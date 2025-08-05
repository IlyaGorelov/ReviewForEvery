import React, { useEffect, useState } from "react";
import { ReviewGet } from "../Models/Review";
import { useNavigate } from "react-router-dom";
import { FilmGet } from "../Models/Film";
import { getFilmByIdApi } from "../Services/FilmService";
import { toast } from "react-toastify";

type Props = {
  review: ReviewGet;
  handleDelete: (id: number) => void;
};

const ReviewCard = ({ review, handleDelete }: Props) => {
  const navigate = useNavigate();
  const [film,setFilm] = useState<FilmGet>();

  const getFilm = async () => {
      await getFilmByIdApi(Number(review.filmId))
        .then((res) => {
          if (res?.data) {
            setFilm(res.data);
          }
        })
        .catch((e) => {
          toast.warning("No film found");
        });
    };

  useEffect(()=>{
    getFilm()
  },[])
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">{film?.title}</h2>
      <p className="mb-1">Оценка: {review.rate} / 10</p>
      <p className="mb-1">Статус: {review.status}</p>
      <p className="text-gray-700 mb-2">{review.text}</p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/edit-review/${review.id}`)}
          className="text-blue-600 hover:underline"
        >
          Редактировать
        </button>
        <button
          onClick={() => handleDelete(review.id)}
          className="text-red-600 hover:underline"
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
