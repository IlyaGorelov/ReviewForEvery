import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import SearchPage from "./Pages/SearchPage";
import FilmPage from "./Pages/FilmPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import { AccountPage } from "./Pages/AccountPage";
import ProtectedRouteForAdmin from "./ProtectedRouteForAdmin";
import { AddFilmPage } from "./Pages/AddFilmPage";
import AllMyReviews from "./Pages/AllMyReviews";

type Props = {};

const AppRoutes = (props: Props) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/add" element={<SearchPage />} />
      <Route path="/film/:id" element={<FilmPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/account" element={<ProtectedRoute><AccountPage/></ProtectedRoute>}/>
      <Route path="/add-film" element={<ProtectedRouteForAdmin><AddFilmPage/></ProtectedRouteForAdmin>}/>
      <Route path="/my-reviews" element={<ProtectedRoute><AllMyReviews/></ProtectedRoute>}/>
    </Routes>
  );
};

export default AppRoutes;
