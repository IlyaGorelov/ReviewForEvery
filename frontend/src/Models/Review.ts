import { FilmForReviewGet, FilmGet } from "./Film";

export type ReviewGet = {
  id: number;
  author: string;
  text: string | null;
  status: number;
  countOfSeasons: string;
  rate: number | null;
  createdAt: Date;
  takeInRating: boolean;
  countOfHoures: number | null,
  countOfMinutes: number | null,
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
  countOfHoures: number | null,
  countOfMinutes: number | null,
  startDate: string | null;
  endDate: string | null;
  filmId: number;
  film: FilmForReviewGet;
  createdAt: Date;
};

export type ReviewPost = {
  text: string | null;
  rate: string | null;
  countOfSeasons: string | null;
  takeInRating: boolean;
  countOfHoures: number | null,
  countOfMinutes: number | null,
  startDate: string | null;
  endDate: string | null;
  status: number;
  filmId: number;
};

export type ReviewUpdate = {
  text: string | null;
  countOfSeasons: string | null;
  status: number;
  takeInRating: boolean;
  countOfHoures: number | null,
  countOfMinutes: number | null,
  startDate: string | null;
  endDate: string | null;
  rate: number | null;
};
