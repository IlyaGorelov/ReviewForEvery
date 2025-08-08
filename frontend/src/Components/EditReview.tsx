import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { ReviewFormsInput } from "./AddReview";
import { deleteMyReviewAPI, deleteReviewAPI, updateMyReviewApi } from "../Services/ReviewService";
import { data } from "react-router-dom";

type Props = {
  initialReview: ReviewFormsInput;
  reviewId: number;
  onClose: () => void;
  onSuccess: () => void;
  hasSeasons: boolean;
};

const validation = Yup.object().shape({
  rate: Yup.number()
    .min(0, "Минимум 0")
    .max(10, "Максимум 10")
    .nullable()
    .when("status", {
      is: (val: number) => val < 2,
      then: (schema) => schema.required("Оценка обязательна"),
      otherwise: (schema) => schema.nullable(),
    }),
  text: Yup.string().when("status", {
    is: (val: number) => val < 2,
    then: (schema) => schema.required("Текст обязателен"),
    otherwise: (schema) => schema.nullable(),
  }),
  status: Yup.number()
    .oneOf([0, 1, 2, 3], "Выберите статус")
    .required("Статус обязателен"),
  countOfSeasons: Yup.string(),
  startDate: Yup.string().nullable().default(null),
  endDate: Yup.string().nullable().default(null),
  takeInRating: Yup.boolean()
});

const EditReview = ({
  initialReview,
  reviewId,
  onClose,
  onSuccess,
  hasSeasons,
}: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormsInput>({
    resolver: yupResolver(validation),
    defaultValues: {
      rate: initialReview.rate,
      text: initialReview.text,
      status: initialReview.status,
      takeInRating:initialReview.takeInRating,
      countOfSeasons: initialReview.countOfSeasons,
      startDate: initialReview.startDate ? initialReview.startDate.split("T")[0] : null,
      endDate: initialReview.endDate ? initialReview.endDate.split("T")[0] : null,
    },
  });

  useEffect(()=>{
    console.log(initialReview.startDate)
  },[])

  const status = watch("status");
  const isWatching = Number(status) >= 2;

  useEffect(() => {
    if (isWatching) {
      setValue("rate", null);
      setValue("text", null);
    }
  }, [status, setValue]);

  const deleteReview = async () => {
    await deleteMyReviewAPI(reviewId);
    onSuccess();
    onClose();
  };

  const onSubmit = async (form: ReviewFormsInput) => {
    try {
      console.log(form.startDate);
      await updateMyReviewApi(
        reviewId,
        form.text,
        form.rate,
        form.status,
        form.countOfSeasons,
        form.takeInRating,
        form.startDate,
        form.endDate
      );
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Не удалось обновить отзыв");
    }
  };

  return (
    <>
      <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full h-full max-w-5xl overflow-auto flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Редактировать отзыв</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-grow"
        >
          <div className="flex flex-col md:flex-row gap-10 md:gap-30 mb-4">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium mb-1">Оценка:</label>
              <input
                type="number"
                min="1"
                step="0.1"
                max="10"
                className="w-full p-2 border rounded"
                {...register("rate")}
                required
                disabled={isWatching}
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center">
              <label htmlFor="takeInReview" className="text-sm font-medium">
                Финальная оценка?
              </label>
              <input
                type="checkbox"
                {...register("takeInRating")}
                className="mt-3 appearance-none w-6 h-6 border border-gray-400 rounded-full checked:bg-blue-500 checked:border-blue-600 transition-all duration-200"
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
              <input
                className="border rounded"
                type="date"
                {...register("startDate")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Конец</label>
              <input
                className="border rounded"
                type="date"
                {...register("endDate")}
              />
              {errors.endDate && <p>{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="flex-grow flex flex-col mb-4 overflow-hidden">
            <label htmlFor="text" className="block font-medium">
              Текст:
            </label>
            <textarea
              id="text"
              {...register("text")}
              disabled={isWatching}
              className="w-full  min-h-[200px] flex-grow px-3 py-2 border rounded resize-none overflow-auto"
            />
            {errors.text && (
              <p className="text-red-500 text-sm">{errors.text.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={deleteReview}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
            >
              Удалить
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditReview;
