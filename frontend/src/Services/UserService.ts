import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { TopListGet, TopListPost } from "../Models/TopList";
import { UserGet } from "../Models/User";

const api = "http://localhost:5257/api/";

// export const postTopListAPI = async (
//   name:string
// ) => {
//   try {
//     const result = await axios.post<TopListPost>(api + "TopList", {
//       name:name
//     });
//     return result;
//   } catch (error) {
//     handleError(error);
//   }
// };

// export const getAllMyTopListsApi = async () => {
//   try {
//     const result = await axios.get<TopListGet[]>(api + "TopList");
//     return result;
//   } catch (error) {
//     handleError(error);
//   }
// };

export const getUserByNameApi = async (name:string) => {
  try {
    const result = await axios.get<UserGet>(api + `Account/${name}`);
    return result;
  } catch (error) {
    handleError(error);
  }
};

// export const updateTopListApi = async (
//   name:string,
//   listId:number
// ) => {
//   try {
//     const result = await axios.put<TopListPost>(api + `TopList/${listId}`, {
//       name:name
//     });
//     return result;
//   } catch (error) {
//     handleError(error);
//   }
// };

