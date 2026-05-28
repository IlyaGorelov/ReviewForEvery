import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { postReviewAPI } from "../Services/ReviewService";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
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
    .min(0, "Minimum 0")
    .max(10, "Maximum 10")
    .nullable()
    .when("status", {
      is: (val: number) => val < 2,
      then: (schema) => schema.required("Rating is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  text: Yup.string().when("status", {
    is: (val: number) => val < 2,
    then: (schema) => schema.required("Text is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  status: Yup.number()
    .oneOf([0, 1, 2, 3], "Select status")
    .required("Status is required"),
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
  const hideInputs = Number(status) >= 2;
  const showUsedTime = film!.filmCategory >= 4;

  useEffect(() => {
    if (hideInputs) {
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
      form.countOfSeasons,
      form.takeInRating,
      form.countOfHoures,
      form.countOfMinutes,
      form.startDate,
      form.endDate,
      form.status,
      Number(id),
    ).catch(() => {
      toast.warning("Unexpected error");
    });
    closeForm();
    updateFilm();
  };

  return (
    <>
      <div
        onClick={closeForm}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      ></div>

      <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[95%] md:w-4/5 max-w-5xl h-[90%] md:h-4/5 overflow-auto flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Add Review
          </h2>
          <button
            onClick={closeForm}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
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

        <form
          onSubmit={handleSubmit(postReview)}
          className="flex flex-col flex-grow p-6"
        >
          <div className="space-y-6">
            {/* Row 1: Rating + Final + Part (if has seasons) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Rating <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="1.0 - 10.0"
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    hideInputs ? "bg-gray-100" : ""
                  }`}
                  {...register("rate")}
                  disabled={hideInputs}
                />
                {errors.rate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.rate.message}
                  </p>
                )}
              </div>

              {/* Final rating checkbox */}
              <div className="flex flex-col items-start justify-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("takeInRating")}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Include in average?
                  </span>
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  If unchecked, this rating won't affect overall score
                </p>
              </div>

              {/* Part (season) */}
              {hasSeasons && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Part / Season
                  </label>
                  <input
                    placeholder="e.g., Season 1, Vol. 2"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("countOfSeasons")}
                  />
                </div>
              )}
            </div>

            {/* Row 2: Status + Date range + Time spent */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("status")}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Completed</option>
                  <option value={1}>Abandoned</option>
                  <option value={2}>Backlogged</option>
                  <option value={3}>In progress</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Date range */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Period
                </label>
                <div className="flex gap-3">
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Start"
                    {...register("startDate")}
                  />
                  <span className="text-gray-400 self-center">—</span>
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="End"
                    {...register("endDate")}
                  />
                </div>
              </div>

              {/* Time spent (only for books/games) */}
              {showUsedTime && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Time spent
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="number"
                      min="0"
                      placeholder="Hours"
                      className={`w-24 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        hideInputs ? "bg-gray-100" : ""
                      }`}
                      {...register("countOfHoures")}
                      disabled={hideInputs}
                    />
                    <span className="text-gray-600">h</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Minutes"
                      className={`w-24 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        hideInputs ? "bg-gray-100" : ""
                      }`}
                      {...register("countOfMinutes")}
                      disabled={hideInputs}
                    />
                    <span className="text-gray-600">min</span>
                  </div>
                </div>
              )}
            </div>

            {/* Review text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Review <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`w-full min-h-[300px] px-3 py-2 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  hideInputs ? "bg-gray-100" : ""
                }`}
                {...register("text")}
                disabled={hideInputs}
                placeholder="Write your thoughts here..."
              />
              {errors.text && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.text.message}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={closeForm}
              className="px-5 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition shadow-sm"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddReview;
