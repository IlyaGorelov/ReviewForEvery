import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserGet } from "../Models/User";
import { api } from "./api";

export const getUserByNameApi = async (name:string) => {
  try {
    const result = await axios.get<UserGet>(api + `Account/${name}`);
    return result;
  } catch (error) {
    handleError(error);
  }
};
