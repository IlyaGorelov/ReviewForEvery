import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfileToken } from "../Models/User";
import { toast } from "react-toastify";

const api = "http://localhost:5257/api/";

export const loginAPI = async (email: string, password: string)=>{
    try {
        const data = await axios.post<UserProfileToken>(api+"Account/login",{
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
        const data = await axios.post<UserProfileToken>(api+"account/register",{
            userName: userName,
            email: email,
            password: password,
        });
        return data;
    } catch (error) {
        handleError(error)
    } 
}

export const registerAdminAPI = async (userName: string,email: string, password: string)=>{
    try {
        const data = await axios.post<UserProfileToken>(api+"account/register-admin",{
            userName: userName,
            email: email,
            password: password,
        });
        toast.success("Успех");
        return data;
    } catch (error) {
        handleError(error)
    } 
}

export const deleteMeApi = async ()=>{
    try {
        const data = await axios.delete(api+"account");
        return data;
    } catch (error) {
        handleError(error)
    } 
}

export const deleteAnyAccountApi = async (userName:string)=>{
    try {
        const data = await axios.delete(api+`account/admin/${userName}`);
        return data;
    } catch (error) {
        handleError(error)
    } 
}