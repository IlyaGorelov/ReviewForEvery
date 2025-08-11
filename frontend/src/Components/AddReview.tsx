import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/useAuth";
import { useParams } from "react-router-dom";
import { postReviewAPI } from "../Services/ReviewService";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FilmGet } from "../Models/Film";

type Props = {
  closeForm: () => void;
  updateFilm: () => void;
  hasSeasons: boolean;
  film: FilmGet | null;
};

export interface ReviewFormsInput {
  rate: number | null;
  text: string | null;
  status: number;
  countOfSeasons: string | null;
  startDate: string | null;
  endDate: string | null;
  takeInRating: boolean;
  countOfHoures: number | null;
  countOfMinutes: number | null;
}

const validation = Yup.object().shape({
  rate: Yup.number()
    .min(0, "Минимум 0")
    .max(10, "Максимум 10")
    .nullable()
    .when("status", {
      is: (val: number) => val !== 3,
      then: (schema) => schema.required("Оценка обязательна"),
      otherwise: (schema) => schema.nullable(),
    }),
  text: Yup.string().when("status", {
    is: (val: number) => val !== 3,
    then: (schema) => schema.required("Текст обязателен"),
    otherwise: (schema) => schema.nullable(),
  }),
  status: Yup.number()
    .oneOf([0, 1, 2, 3], "Выберите статус")
    .required("Статус обязателен"),
  countOfSeasons: Yup.string()
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),
  startDate: Yup.string()
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),
  endDate: Yup.string()
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),
  takeInRating: Yup.boolean().required(),
  countOfHoures: Yup.number()
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),
  countOfMinutes: Yup.number()
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),
});

const AddReview = ({ closeForm, updateFilm, hasSeasons, film }: Props) => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormsInput>({
    resolver: yupResolver(validation),
    defaultValues: {
      startDate: null,
      endDate: null,
      takeInRating: true,
      countOfSeasons: null,
      countOfHoures: null,
      countOfMinutes: null,
    },
  });

  const status = watch("status");
  const isWatching = Number(status) >= 2;
  const showUsedTime = film!.filmCategory >= 4;

  useEffect(() => {
    if (isWatching) {
      setValue("rate", null);
      setValue("text", null);
      setValue("countOfHoures", null);
      setValue("countOfMinutes", null);
    }
  }, [status, setValue]);

  const postReview = async (form: ReviewFormsInput) => {
    await postReviewAPI(
      form.text,
      form.rate,
      form.status,
      Number(id),
      form.countOfSeasons,
      form.takeInRating,
      form.countOfHoures,
      form.countOfMinutes,
      form.startDate,
      form.endDate
    )
      .then((res) => {
        console.log(res?.data);
        if(res?.data)
        toast.success("Отзыв добавлен");
      })
      .catch((e) => {
        toast.warning("Unexpected error");
      });
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
          <div className="flex flex-col md:flex-row gap-10 md:gap-30 mb-4">
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
                disabled={isWatching}
                required
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
              <input type="date" {...register("startDate")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Конец</label>
              <input type="date" {...register("endDate")} />
              {errors.endDate && <p>{errors.endDate.message}</p>}
            </div>

            {showUsedTime && (
              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-1">
                  Использованное время
                </label>

                <div className="flex flex-row items-end">
                  <input
                    disabled={isWatching}
                    type="number"
                    min={1}
                    className="w-[50px] p-2 border rounded"
                    {...register("countOfHoures")}
                  />
                  <label className="ml-2 block text-lg font-medium mb-1">
                    ч.
                  </label>
                  {errors.endDate && <p>{errors.endDate.message}</p>}

                  <input
                    disabled={isWatching}
                    type="number"
                    min={1}
                    className="appearance-text ml-5 w-[50px] p-2 border rounded"
                    {...register("countOfMinutes")}
                  />
                  <label className="ml-2 block text-lg font-medium mb-1">
                    м.
                  </label>
                  {errors.endDate && <p>{errors.endDate.message}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="flex-grow flex flex-col mb-4 overflow-hidden">
            <label className="block text-sm font-medium mb-1">Текст:</label>
            <textarea
              className="w-full  min-h-[200px] flex-grow px-3 py-2 border rounded resize-none overflow-auto"
              {...register("text")}
              required
              disabled={isWatching}
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
