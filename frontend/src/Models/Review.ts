export type ReviewGet = {
  id: number;
  author: string;
  text: string;
  status: number;
  countOfSeasons: string;
  rate: number;
  date: Date;
  startDate: string | null;
  endDate: string | null;
  filmId: number;
};

export type ReviewPost = {
  text: string;
  rate: string;
  countOfSeasons: string;
  status: number;
  startDate: string | null;
  endDate: string | null;
  filmId: number;
};

export type ReviewUpdate = {
  text: string;
  countOfSeasons: string;
  status: number;
  startDate: string | null;
  endDate: string | null;
  rate: number;
};
