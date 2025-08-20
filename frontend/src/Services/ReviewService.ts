import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { ReviewGet, ReviewPost, ReviewUpdate } from "../Models/Review";
import { api } from "./api";

export const postReviewAPI = async (
  text: string | null,
  rate: number | null,
  countOfSeasons: string | null,
  takeInRating: boolean,
  countOfHoures: number | null,
  countOfMinutes: number | null,
  startDate: string | null,
  endDate: string | null,
  status: number,
  filmId: number,
) => {
  try {
    const result = await axios.post<ReviewPost>(api + "Reviews", {
      text: text,
      rate: rate,
      countOfSeasons: countOfSeasons,
      takeInRating: takeInRating,
      countOfHoures: countOfHoures,
      countOfMinutes: countOfMinutes,
      startDate: startDate,
      endDate: endDate,
      status: status,
      filmId: filmId,
    });
    return result;
  } catch (error) {
    handleError(error);
  }
};

export const getAllMyReviewsApi = async () => {
  try {
    const result = await axios.get<ReviewGet[]>(api + "Reviews");
    return result;
  } catch (error) {
    handleError(error);
  }
};


export const getAllReviewsApi = async () => {
  try {
    const result = await axios.get<ReviewGet[]>(api + "Reviews/admin");
    return result;
  } catch (error) {
    handleError(error);
  }
};

export const updateMyReviewApi = async (
  reviewId: number,
  newText: string | null,
  newRate: number | null,
  newStatus: number,
  newCountOfSeasons: string | null,
  takeInRating: boolean,
  countOfHoures: number | null,
  countOfMinutes: number | null,
  startDate?: string | null,
  endDate?: string | null
) => {
  try {
    const result = await axios.put<ReviewUpdate>(api + `Reviews/${reviewId}`, {
      text: newText,
      rate: newRate,
      status: newStatus,
      takeInRating: takeInRating,
      countOfSeasons: newCountOfSeasons,
      startDate: startDate,
      endDate: endDate,
      countOfHoures: countOfHoures,
      countOfMinutes: countOfMinutes
    });
    return result;
  } catch (error) {
    handleError(error);
  }
};

export const deleteReviewAPI = async (id: number) => {
  try {
    const result = await axios.delete(api + `Reviews/admin/${id}`);
    return result;
  } catch (error) {
    handleError(error);
  }
};

export const deleteMyReviewAPI = async (id: number) => {
  try {
    const result = await axios.delete(api + `Reviews/${id}`);
    return result;
  } catch (error) {
    handleError(error);
  }
};
