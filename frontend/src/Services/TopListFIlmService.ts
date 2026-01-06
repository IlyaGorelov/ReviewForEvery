import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { ReviewGet, ReviewPost, ReviewUpdate } from "../Models/Review";
import { stat } from "fs";
import {
  TopListFilmGet,
  TopListFilmPost,
  TopListFilmUpdate,
} from "../Models/TopListFilm";
import { api } from "./api";

export const postTopListFilmApi = async (
  filmId: number,
  position: number,
  topListId: number,
  comment: string | null
) => {
  try {
    const result = await axios.post<TopListFilmPost>(api + "TopListFilm", {
      filmId: filmId,
      position: position,
      topListId: topListId,
      comment: comment,
    });
    return result;
  } catch (error) {
    handleError(error);
  }
};

export const getAllTopFilmsApi = async (topListId: number) => {
  try {
    const result = await axios.get<TopListFilmGet[]>(
      api + `TopListFilm/getAll/${topListId}`
    );
    return result;
  } catch (error) {
    handleError(error);
  }
};

export const updateTopListFilmApi = async (id: number, position: number) => {
  try {
    const result = await axios.put<TopListFilmUpdate>(
      api + `TopListFIlm/${id}`,
      {
        position: position,
      }
    );
    return result;
  } catch (error) {
    handleError(error);
  }
};

export const deleteTopFilmApi = async (id: number) => {
  try {
    const result = await axios.delete(api + `TopListFilm/${id}`);
    return result;
  } catch (error) {
    handleError(error);
  }
};

export const reorderTopListFilmsApi = async (
  topListId: number,
  items: { id: number; position: number }[]) => {
  try {
    const result = await axios.put(api + `TopListFilm/${topListId}/reorder`, { items });;
    return result;
  } catch (error) {
    handleError(error);
  }
};
