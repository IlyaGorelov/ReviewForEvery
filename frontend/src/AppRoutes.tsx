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
import AllReviewsList from "./Pages/AllReviewsList";
import TopListsPage from "./Pages/TopListsPage";
import TopListPage from "./Pages/TopListPage";
import { ForeignAccountPage } from "./Pages/ForeignAccountPage";
import AllUserReviews from "./Pages/AllUserReviews";
import TopListsPageForOtherUser from "./Pages/TopListsPageForOtherUser";
import TopListPageForOtherUser from "./Pages/TopListPageForOtherUser";

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
      <Route path="/user/:username" element={<ForeignAccountPage/>}/>
      <Route path="/user/:username/all-reviews" element={<AllUserReviews/>}/>
      <Route path="/user/:username/top-lists" element={<TopListsPageForOtherUser/>}/>
      <Route path="/user/:username/top-lists/:listId" element={<TopListPageForOtherUser/>}/>
      <Route path="/add-film" element={<ProtectedRouteForAdmin><AddFilmPage/></ProtectedRouteForAdmin>}/>
      <Route path="/reviews" element={<ProtectedRouteForAdmin><AllReviewsList/></ProtectedRouteForAdmin>}/>
      <Route path="/my-reviews" element={<ProtectedRoute><AllMyReviews/></ProtectedRoute>}/>
      <Route path="/top-lists" element={<ProtectedRoute><TopListsPage/></ProtectedRoute>}/>
      <Route path="/top-lists/:id" element={<ProtectedRoute><TopListPage/></ProtectedRoute>}/>
    </Routes>
  );
};

export default AppRoutes;
