export type FilmGet = {
    id: number,
    title: string,
    filmType: number,
    imageUrl: string,
    rating: number,
    filmCategory:number,
    reviews: any
}

export type FilmForReviewGet = {
    id: number,
    title: string,
    imageUrl: string,
    filmCategory:number,
    filmType:number
}

export type FilmPost = {
    title: string,
    filmType: number,
    imageUrl: string
    filmCategory:number
}