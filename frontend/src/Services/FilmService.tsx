import api from "../api/api";
import { handleError } from "../Helpers/ErrorHandler";
import { FilmGet } from "../Models/Film";

export const getAllFilmsApi = async () => {
  try {
    const result = await api.get<FilmGet[]>("Films");
    return result;
  } catch (error) {
    handleError(error);

  }
};
