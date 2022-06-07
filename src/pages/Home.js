// import { Login } from "@mui/icons-material";
import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Artists from "./Artists";
import Login from "../components/Login";
import Songs from "./Songs";
import Navbar from "../components/Navbar";
import AddSong from "./AddSong";

const Home = () => {
  const location = useLocation();

  return (
    <div>
      <Navbar />
      {/* <Routes> */}
      {location.pathname === "/songs" ? (
        <Songs />
      ) : location.pathname === "/artists" ? (
        <Artists />
      ) : location.pathname === "/add" ? (
        <AddSong />
      ) : (
        ""
      )}
      {/* // <Route path="/songs" element={} />
        // <Route path="/artists" element={} /> */}
      {/* </Routes> */}
    </div>
  );
};

export default Home;
