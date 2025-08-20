import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { FilmGet, FilmPost } from "../Models/Film";
import { api } from "./api";


export const getAllFilmsApi = async () => {
  try {
    const result = await axios.get<FilmGet[]>(api + "Films");
    return result;
  } catch (error) {
    handleError(error);
  }
};

export const getFilmByIdApi = async (id: number | undefined) => {
  try {
    const result = await axios.get<FilmGet>(api + `Films/${id}`);
    return result;
  } catch (error) {
    handleError(error);
  }
};

export const postFilmApi = async (
  title: string,
  filmType: number,
  imageUrl: string,
  filmCategory: number
) => {
  try {
    const result = await axios.post<FilmPost>(api + `Films`, {
      title: title,
      filmType: filmType,
      imageUrl: imageUrl,
      filmCategory: filmCategory,
    });
    return result;
  } catch (error) {
    handleError(error);
  }
};

export const deleteFilmApi = async (id: number) => {
  try {
    const result = await axios.delete(api + `Films/${id}`);
    return result;
  } catch (error) {
    handleError(error);
  }
};

export const updateFilmApi = async (
  filmId: number,
  title: string,
  filmType: number,
  imageUrl: string,
  filmCategory: number
) => {
  try {
    const result = await axios.put<FilmPost>(api + `Films/${filmId}`, {
      title: title,
      filmType: filmType,
      imageUrl: imageUrl,
      filmCategory: filmCategory,
    });
    return result;
  } catch (error) {
    handleError(error);
  }
};
