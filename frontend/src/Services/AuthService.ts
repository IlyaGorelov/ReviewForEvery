import api from "../api/api"
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfileToken } from "../Models/User";

export const loginAPI = async (email: string, password: string)=>{
    try {
        const data = await api.post<UserProfileToken>("Account/login",{
            email: email,
            password: password,
        });
        return data;
    } catch (error) {
        handleError(error)
        
        console.log(error)
    } 
}

export const registerAPI = async (userName: string,email: string, password: string)=>{
    try {
        const data = await api.post<UserProfileToken>("account/register",{
            userName: userName,
            email: email,
            password: password,
        });
        return data;
    } catch (error) {
        handleError(error)
    } 
}