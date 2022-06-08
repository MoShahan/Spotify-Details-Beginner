import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const Songs = () => {
  const [sortedSongs, setSortedSongs] = useState([]);
  const [displayingSongs, setDisplayingSongs] = useState([]);
  const [top10Songs, setTop10Songs] = useState([]);
  const [ratingValue, setRatingValue] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3001/get/songs")
      .then((response) => {
        const tempSortedSongs = response.data.sort((song1, song2) => {
          return song2.ratings - song1.ratings;
        });
        setSortedSongs(tempSortedSongs);
        const tempTop10 = tempSortedSongs.slice(0, 10);
        setTop10Songs(tempTop10);
        setDisplayingSongs(tempTop10);
        response.data.map((song) => {
          setRatingValue((prev) => {
            prev[song.songsName] = song.ratings;
            return prev;
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const toggleDisplayingSongs = () => {
    if (displayingSongs.length === 10) {
      setDisplayingSongs(sortedSongs);
    } else {
      setDisplayingSongs(top10Songs);
    }
  };

  const handleRatingsChange = (event, newValue, song) => {
    const tempData = ratingValue;
    tempData[song.songsName] = newValue;

    axios
      .post("http://localhost:3001/add/ratings", {
        rating: newValue,
        songId: song.idSongs,
      })
      .then(() => {
        console.log("Ratings Changed");
      });
  };

  return (
    <div>
      <h2> Top 10 Songs </h2>
      <table>
        <thead>
          <tr>
            <td> Artwork </td> <td> Song </td> <td> Date of Release </td>
            <td> Artists </td> <td> Ratings </td>
          </tr>
        </thead>
        <tbody>
          {displayingSongs.map((song) => {
            let imageData;
            try {
              imageData = require("../artwork/" + song.image);
            } catch {
              imageData = "";
            }
            return (
              <tr key={song.songsName}>
                <td>
                  <img
                    className="imageArtwork"
                    src={imageData}
                    alt="Song Artwork"
                  />
                </td>
                <td> {song.songsName} </td> <td> {song.date} </td>
                <td> {song.artists} </td>
                <td>
                  <Rating
                    sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
                    emptyIcon={<StarIcon />}
                    value={ratingValue[song.songsName]}
                    onChange={(event, newValue) =>
                      handleRatingsChange(event, newValue, song)
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Button
        variant="contained"
        onClick={toggleDisplayingSongs}
        sx={{
          bgcolor: "rgba(0,0,0)",
          "&:hover": { bgcolor: "white", color: "black" },
          marginBottom: "100px",
        }}
      >
        {displayingSongs.length === 10 ? "See More" : "See Less"}
      </Button>
    </div>
  );
};

export default Songs;
