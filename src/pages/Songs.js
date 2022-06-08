import React, { useEffect, useState } from "react";
// import songs from "../datas/songs.json";
import axios from "axios";
import { Button } from "@mui/material";

const Songs = () => {
  //   console.log(songs);

  const [sortedSongs, setSortedSongs] = useState([]);
  const [displayingSongs, setDisplayingSongs] = useState([]);
  const [top10Songs, setTop10Songs] = useState([]);

  //   let sortedSongs;
  //   let top10Songs;

  useEffect(() => {
    axios
      .get("http://localhost:3001/get/songs")
      .then((response) => {
        // setSongsData(response.data);
        // console.log(response.data);
        const tempSortedSongs = response.data.sort((song1, song2) => {
          return song2.ratings - song1.ratings;
        });
        setSortedSongs(tempSortedSongs);
        // console.log("Inside UseEffect -- sortedSongs", sortedSongs);
        const tempTop10 = tempSortedSongs.slice(0, 10);
        setTop10Songs(tempTop10);
        // console.log("Inside UseEffect -- top10Songs", top10Songs);
        setDisplayingSongs(tempTop10);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  //   const sortedSongs = songs.sort((song1, song2) => {
  //     return song2.ratings - song1.ratings;
  //   });

  //   const sortedSongs = songsData.sort((song1, song2) => {
  //     return song2.ratings - song1.ratings;
  //   });

  //   const top10Songs = sortedSongs.slice(0, 10);

  const toggleDisplayingSongs = () => {
    if (displayingSongs.length === 10) {
      setDisplayingSongs(sortedSongs);
    } else {
      setDisplayingSongs(top10Songs);
    }
  };

  //   console.log("Outside UseEffect -- sortedSongs", sortedSongs);
  //   console.log("Outside UseEffect -- top10Songs", top10Songs);

  return (
    <div>
      <h2>Top 10 Songs</h2>
      {/* <table>
        <thead>
          <tr>
            <td>Artwork</td>
            <td>Song</td>
            <td>Date of Release</td>
            <td>Artists</td>
            <td>Ratings</td>
          </tr>
        </thead>
        <tbody>
          {top10Songs.map((song) => {
            return (
              <tr key={song.songName}>
                <td>{song.image}</td>
                <td>{song.songName}</td>
                <td>{song.date}</td>
                <td>{song.artists.join(", ")}</td>
                <td>{song.ratings}</td>
              </tr>
            );
          })}
        </tbody>
      </table> */}
      <table>
        <thead>
          <tr>
            <td>Artwork</td>
            <td>Song</td>
            <td>Date of Release</td>
            <td>Artists</td>
            <td>Ratings</td>
          </tr>
        </thead>
        <tbody>
          {displayingSongs.map((song) => {
            return (
              <tr key={song.songsName}>
                <td>{song.image}</td>
                <td>{song.songsName}</td>
                <td>{song.date}</td>
                <td>{song.artists}</td>
                <td>{song.ratings}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Button variant="contained" onClick={toggleDisplayingSongs}>
        {displayingSongs.length === 10 ? "See More" : "See Less"}
      </Button>
    </div>
  );
};

export default Songs;
