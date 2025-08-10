import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { ReviewFormsInput } from "./AddReview";
import { deleteReviewAPI, updateMyReviewApi } from "../Services/ReviewService";
import { data } from "react-router-dom";
import { AddFilmFormInput } from "../Pages/AddFilmPage";
import { updateFilmApi } from "../Services/FilmService";

type Props = {
  filmId: number;
  initialFilm: AddFilmFormInput;
  onClose: () => void;
  onSuccess: () => void;
};

const validation = yup.object().shape({
  title: yup.string().required("Введите название"),
  filmType: yup
    .number()
    .oneOf([0, 1], "Выберите тип фильма")
    .required("Тип обязателен"),
  imageUrl: yup.string().required("Введите URL постера"),
  filmCategory: yup
    .number()
    .oneOf([0, 1, 2, 3, 4,5], "Выберите категорию фильма")
    .required("Категория обязательна"),
});

const EditFilm = ({ filmId, initialFilm, onClose, onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddFilmFormInput>({
    resolver: yupResolver(validation),
    defaultValues: {
      title: initialFilm.title,
      filmType: initialFilm.filmType,
      imageUrl: initialFilm.imageUrl,
      filmCategory: initialFilm.filmCategory,
    },
  });

  const onSubmit = async (form: AddFilmFormInput) => {
    try {
      await updateFilmApi(
        filmId,
        form.title,
        form.filmType,
        form.imageUrl,
        form.filmCategory
      );
      toast.success("Фильм обновлён");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Не удалось обновить фильм");
    }
  };

  return (
    <div>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      ></div>

      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full h-3/4 max-h-[450px] max-w-5xl overflow-auto flex flex-col"
      >
        <h2 className="text-2xl font-bold mb-4">Редактировать фильм</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-grow gap-8"
        >
          <div className="w-full md:w-full">
            <label className="block text-lg font-medium mb-1">Название:</label>
            <input
              type="text"
              className="w-full p-2 border-2 rounded tw-border-solid"
              {...register("title")}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Тип</label>
            <select
              {...register("filmType")}
              className="w-full border px-3 py-2 rounded"
            >
              <option value={0}>Нет частей</option>
              <option value={1}>Состоит из частей</option>
            </select>
            {errors.filmType && (
              <p className="text-red-500 text-sm">{errors.filmType.message}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Категория</label>
            <select
              {...register("filmCategory")}
              className="w-full border px-3 py-2 rounded"
            >
              <option value={0}>Фильм</option>
              <option value={1}>Сериал</option>
              <option value={2}>Аниме</option>
              <option value={3}>Мультик</option>
              <option value={4}>Книга</option>
              <option value={5}>Игра</option>
            </select>
            {errors.filmType && (
              <p className="text-red-500 text-sm">{errors.filmType.message}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">URL постера</label>
            <input
              {...register("imageUrl")}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Обновить фильм
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFilm;
