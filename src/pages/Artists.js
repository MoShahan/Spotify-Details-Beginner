import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Artists = () => {
  const [sortedArtists, setSortedArtists] = useState([]);
  const [displayingArtists, setDisplayingArtists] = useState([]);
  const [top10Artists, setTop10Artists] = useState([]);

  const [songsList, setSongsList] = useState([]);

  const [artistsAndSongs, setArtistsAndSongs] = useState({});
  const [artistsAndRatings, setArtistsAndRatings] = useState({});

  useEffect(() => {
    let artistsWithSongs = {};
    let artistsWithRatings = {};

    // getting the songs list
    axios
      .get("http://localhost:3001/get/songs")
      .then((response) => {
        setSongsList(response.data);

        // getting all the songs of each artist and average ratings
        response.data.map((song) => {
          const allArtists = song.artists.split(",");
          allArtists.map((songArtist) => {
            if (artistsWithSongs[songArtist]) {
              artistsWithSongs[songArtist].push(song.songsName);
              artistsWithRatings[songArtist] =
                (artistsWithRatings[songArtist] + song.ratings) / 2;
            } else {
              artistsWithSongs[songArtist] = [song.songsName];
              artistsWithRatings[songArtist] = song.ratings;
            }
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });

    // getting the artist list
    axios
      .get("http://localhost:3001/get/artists")
      .then((response) => {
        // sorting artists based on their average song rating
        const tempSortedArtists = response.data.sort((artist1, artist2) => {
          return (
            artistsWithRatings[artist2.artistsName] -
            artistsWithRatings[artist1.artistsName]
          );
        });
        setSortedArtists(tempSortedArtists);

        //   getting top 10 artists based on rating
        const tempTop10Artists = tempSortedArtists.slice(0, 10);
        setTop10Artists(tempTop10Artists);

        //setting initial display values
        setDisplayingArtists(tempTop10Artists);
      })
      .catch((e) => {
        console.log(e);
      });

    //setting both objects = artists with Ratings & artists with Songs
    setArtistsAndRatings(artistsWithRatings);
    setArtistsAndSongs(artistsWithSongs);
  }, []);

  const toggleDisplayingArtists = () => {
    if (displayingArtists.length === 10) {
      setDisplayingArtists(sortedArtists);
    } else {
      setDisplayingArtists(top10Artists);
    }
  };

  return (
    <div>
      <h2>Top 10 Artists</h2>
      <table>
        <thead>
          <tr>
            <td>Artists</td>
            <td>Date of Birth</td>
            <td>Songs</td>
            <td>Average Rating</td>
          </tr>
        </thead>
        <tbody>
          {displayingArtists.map((artist) => {
            return (
              <tr key={artist.artistsName}>
                <td>{artist.artistsName}</td>
                <td>{artist.dob}</td>
                <td>
                  {artistsAndSongs[artist.artistsName]
                    ? artistsAndSongs[artist.artistsName].join(", ")
                    : ""}
                </td>
                <td>
                  {artistsAndRatings[artist.artistsName]
                    ? artistsAndRatings[artist.artistsName].toFixed(2)
                    : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Button
        variant="contained"
        onClick={toggleDisplayingArtists}
        sx={{
          bgcolor: "rgba(0,0,0)",
          "&:hover": { bgcolor: "white", color: "black" },
          marginBottom: "100px",
        }}
      >
        {displayingArtists.length === 10 ? "See More" : "See Less"}
      </Button>
    </div>
  );
};

export default Artists;
