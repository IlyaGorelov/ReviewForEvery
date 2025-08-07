export type ReviewGet = {
  id: number;
  author: string;
  text: string | null;
  status: number;
  countOfSeasons: string;
  rate: number | null;
  date: Date;
  startDate: string | null;
  endDate: string | null;
  filmId: number;
};

export type ReviewPost = {
  text: string | null;
  rate: string | null;
  countOfSeasons: string;
  status: number;
  startDate: string | null;
  endDate: string | null;
  filmId: number;
};

export type ReviewUpdate = {
  text: string| null;
  countOfSeasons: string;
  status: number;
  startDate: string | null;
  endDate: string | null;
  rate: number | null;
};
