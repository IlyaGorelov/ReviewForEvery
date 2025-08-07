export type TopListFilmGet = {
    id:number,
    filmId:number,
    position: number
    comment:string
}

export type TopListFilmPost = {
    id:number,
    filmId:number,
    position: number
    comment:string
}

export type TopListFilmUpdate = {
    position: number
}