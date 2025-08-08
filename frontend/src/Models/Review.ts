import { FilmForReviewGet, FilmGet } from "./Film";

export type ReviewGet = {
  id: number;
  author: string;
  text: string | null;
  status: number;
  countOfSeasons: string;
  rate: number | null;
  date: Date;
  takeInRating: boolean;
  startDate: string | null;
  endDate: string | null;
  filmId: number;
  film: FilmForReviewGet
};

export type ReviewFromOtherUserGet = {
  id: number;
  text: string | null;
  status: number;
  countOfSeasons: string;
  rate: number | null;
  date: Date;
  takeInRating: boolean;
  startDate: string | null;
  endDate: string | null;
  filmId: number;
  film: FilmForReviewGet
};

export type ReviewPost = {
  text: string | null;
  rate: string | null;
  countOfSeasons: string;
  status: number;
  takeInRating: boolean;
  startDate: string | null;
  endDate: string | null;
  filmId: number;
};

export type ReviewUpdate = {
  text: string | null;
  countOfSeasons: string;
  status: number;
  takeInRating: boolean;
  startDate: string | null;
  endDate: string | null;
  rate: number | null;
};
