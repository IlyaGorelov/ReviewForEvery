import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { ReviewGet, ReviewPost, ReviewUpdate } from "../Models/Review";
import { stat } from "fs";

const api = "http://localhost:5257/api/";

export const postReviewAPI = async (
  text: string | null,
  rate: number | null,
  status: number,
  filmId: number,
  countOfSeasons: string,
  takeInRating: boolean,
  startDate?: string | null,
  endDate?: string | null
) => {
  try {
    const result = await axios.post<ReviewPost>(api + "Reviews", {
      text: text,
      rate: rate,
      status: status,
      filmId: filmId,
      takeInRating: takeInRating,
      countOfSeasons: countOfSeasons,
      startDate: startDate,
      endDate: endDate,
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
  newCountOfSeasons: string,
  takeInRating: boolean,
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
