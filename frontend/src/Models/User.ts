import { ReviewFromOtherUserGet } from "./Review";
import { TopListGet } from "./TopList";

export type UserProfileToken = {
    userName:string;
    email:string;
    role:string;
    token: string
}

export type UserProfile = {
    userName:string;
    email:string;
    role: string
}

export type UserGet = {
    username: string;
    reviews: any;
    topLists: any;
}