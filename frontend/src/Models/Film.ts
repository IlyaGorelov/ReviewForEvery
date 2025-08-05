export type FilmGet = {
    id: number,
    title: string,
    filmType: number,
    imageUrl: string,
    rating: number,
    reviews: any
}

export type FilmPost = {
    title: string,
    filmType: number,
    imageUrl: string
}