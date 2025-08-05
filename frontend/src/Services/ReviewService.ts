import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { ReviewGet, ReviewPost, ReviewUpdate } from "../Models/Review";
import { stat } from "fs";

const api = "http://localhost:5257/api/";

export const postReviewAPI = async (
  text: string,
  rate: number,
  status: number,
  filmId: number,
  countOfSeasons:string,
  startDate?:string|null,
  endDate?:string|null,
) => {
  try {
    const result = await axios.post<ReviewPost>(api + "Reviews", {
      text: text,
      rate: rate,
      status:status,
      filmId: filmId,
      countOfSeasons: countOfSeasons,
      startDate:startDate,
      endDate:endDate
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

export const updateMyReviewApi = async (
  reviewId: number,
  newText: string,
  newRate: number,
  newStatus: number,
  newCountOfSeasons: string,
  startDate?:string|null,
  endDate?:string|null,
) => {
  try {
    const result = await axios.put<ReviewUpdate>(api + `Reviews/${reviewId}`, {
      text: newText,
      rate: newRate,
      status: newStatus,
      countOfSeasons: newCountOfSeasons,
      startDate:startDate,
      endDate:endDate
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
