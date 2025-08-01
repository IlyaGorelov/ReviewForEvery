import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./Context/useAuth";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Header />
        <div className="flex flex-col">
          <div className="flex-grow">
            <AppRoutes />
          </div>
          <Footer />
        </div>
        <ToastContainer />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
