import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./components/Navbar";
import "./index.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Songs from "./pages/Songs";
import Artists from "./pages/Artists";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </BrowserRouter>
);
