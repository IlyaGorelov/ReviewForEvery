import React, { useState } from "react";
import { useAuth } from "../Context/useAuth";
import { useParams } from "react-router-dom";
import { postReviewAPI } from "../Services/ReviewService";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";

type Props = {
  closeForm: () => void;
  updateFilm: () => void;
  hasSeasons: boolean;
};

export interface ReviewFormsInput {
  rate: number;
  text: string;
  status: number;
  countOfSeasons: string;
  startDate: string | null;
  endDate: string | null;
}

const validation = Yup.object().shape({
  rate: Yup.number()
    .required("Оценка обязательна")
    .min(0, "Минимум 0")
    .max(10, "Максимум 10"),
  text: Yup.string().required("Отзыв обязателен"),
  status: Yup.number()
    .oneOf([0, 1, 2, 3], "Выберите статус")
    .required("Статус обязателен"),
  countOfSeasons: Yup.string(),
  startDate: Yup.string().nullable().default(null),
  endDate: Yup.string()
    .nullable()
    .default(null),
});

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

const AddReview = ({ closeForm, updateFilm, hasSeasons }: Props) => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormsInput>({
    resolver: yupResolver(validation),
    defaultValues: {
      startDate: null,
      endDate: null,
    },
  });

  const postReview = async (form: ReviewFormsInput) => {
    console.log(form.startDate)
    await postReviewAPI(
      form.text,
      form.rate,
      form.status,
      Number(id),
      form.countOfSeasons,
      form.startDate,
      form.endDate
    ).catch((e) => {
      toast.warning("Unexpected error");
    });
    toast.success("Отзыв добавлен");
    closeForm();
    updateFilm();
  };

  return (
    <>
      <div
        onClick={closeForm}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
      ></div>

      <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-4/5 h-4/5 max-w-5xl overflow-auto flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Оставить отзыв</h2>
        <form
          onSubmit={handleSubmit(postReview)}
          className="flex flex-col flex-grow"
        >
          <div className="flex flex-col md:flex-row gap-10 md:gap-40 mb-4">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium mb-1">Оценка:</label>
              <input
                placeholder="1.0 - 10.0"
                type="number"
                min="1"
                step="0.1"
                max="10"
                className="w-full p-2 border rounded"
                {...register("rate")}
                required
              />
            </div>

            {hasSeasons && (
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium mb-1">Часть</label>
                <input
                  placeholder="Сезон 1 | Сезоны 1-2 | Том 1"
                  type="text"
                  className="w-full p-2 border rounded"
                  {...register("countOfSeasons")}
                />
              </div>
            )}

            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium mb-1">Статус</label>
              <select
                {...register("status")}
                className="w-full p-2 border rounded mb-2"
              >
                <option value={0}>Завершён</option>
                <option value={1}>Брошен</option>
                <option value={2}>Отложен</option>
                <option value={3}>Смотрю</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10 md:gap-40 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Начало</label>
              <input type="date" {...register("startDate")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Конец</label>
              <input type="date" {...register("endDate")} />
              {errors.endDate && <p>{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="flex-grow flex flex-col mb-4 overflow-hidden">
            <label className="block text-sm font-medium mb-1">Текст:</label>
            <textarea
              className="w-full  min-h-[200px] flex-grow px-3 py-2 border rounded resize-none overflow-auto"
              {...register("text")}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Отправить
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddReview;
