import { TopListFilmGet } from "./TopListFilm"

export type TopListPost = {
    name:string
}

export type TopListGet = {
    id:number,
    name:string,
    topListFilms: TopListFilmGet[] | null
}