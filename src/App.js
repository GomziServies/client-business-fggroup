import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/profile";
import Login from "./pages/login";
import ScrollRestoration from "./components/ScrollRestoration";
import ViewGymListing from "./pages/view-gym-listing";
import AllGymListing from "./pages/all-gym-listing";
import BuyFormComponent from "./pages/page-form";

function App() {
  return (
    <div className="text-center font-bold">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/all-gym-listing" element={<AllGymListing />} />
        <Route path="/gym-listing-view" element={<ViewGymListing />} />
        <Route path="/page-form" element={<BuyFormComponent />} />
      </Routes>
      <ScrollRestoration />
    </div>
  );
}

export default App;
