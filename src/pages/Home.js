import React from "react";
import { useLocation } from "react-router-dom";
import Artists from "./Artists";
import Songs from "./Songs";
import Navbar from "../components/Navbar";
import AddSong from "./AddSong";
import "../styles/Home.css";
import AboutUs from "./AboutUs";
import HomeProperties from "../components/HomeProperties";

const Home = () => {
  const location = useLocation();

  return (
    <div>
      <Navbar />
      {location.pathname === "/home" ? (
        <HomeProperties />
      ) : location.pathname === "/songs" ? (
        <Songs />
      ) : location.pathname === "/artists" ? (
        <Artists />
      ) : location.pathname === "/add" ? (
        <AddSong />
      ) : location.pathname === "/about" ? (
        <AboutUs />
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
