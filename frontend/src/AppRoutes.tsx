import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import SearchPage from "./Pages/SearchPage";
import FilmPage from "./Pages/FilmPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedRouteForAdmin from "./ProtectedRouteForAdmin";
import { AddFilmPage } from "./Pages/AddFilmPage";
import TopListsPage from "./Pages/MyAccount/TopListsPage";
import TopListPage from "./Pages/MyAccount/TopListPage";
import RegisterAdminPage from "./Pages/RegisterAdminPage";
import ReviewsPage from "./Pages/MyAccount/ReviewsPage";
import AccountPage from "./Pages/MyAccount/AccountPage";

type Props = {};

const AppRoutes = (props: Props) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/add" element={<SearchPage />} />
      <Route path="/film/:id" element={<FilmPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />
      <Route path="/user/:username" element={<AccountPage />} />
      <Route
        path="/user/:username/all-reviews"
        element={<ReviewsPage variant={"user"} />}
      />
      <Route
        path="/user/:username/top-lists"
        element={<TopListsPage variant={"user"} />}
      />
      <Route
        path="/user/:username/top-lists/:listId"
        element={<TopListPage variant={"readonly"} />}
      />
      <Route
        path="/add-film"
        element={
          <ProtectedRouteForAdmin>
            <AddFilmPage />
          </ProtectedRouteForAdmin>
        }
      />
      <Route
        path="/reviews"
        element={
          <ProtectedRouteForAdmin>
            <ReviewsPage variant={"all"} />
          </ProtectedRouteForAdmin>
        }
      />
      <Route
        path="/register-admin"
        element={
          <ProtectedRouteForAdmin>
            <RegisterAdminPage />
          </ProtectedRouteForAdmin>
        }
      />
      <Route
        path="/my-reviews"
        element={
          <ProtectedRoute>
            <ReviewsPage variant={"my"} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/top-lists"
        element={
          <ProtectedRoute>
            <TopListsPage variant={"my"} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/top-lists/:id"
        element={
          <ProtectedRoute>
            <TopListPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
