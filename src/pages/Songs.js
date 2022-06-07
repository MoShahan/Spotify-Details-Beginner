import React from "react";
import songs from "../datas/songs.json";

const Songs = () => {
//   console.log(songs);    

  const sortedSongs = songs.sort((song1, song2) => {
    return song2.ratings - song1.ratings;
  });

  const top10Songs = sortedSongs.slice(0, 10);

  return (
    <div>
      <h2>Top 10 Songs</h2>
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
          {top10Songs.map((song) => {
            return (
              <tr key={song.songName}>
                <td>{song.image}</td>
                <td>{song.songName}</td>
                <td>{song.date}</td>
                <td>
                  {/* {song.artists.map((artist) => (
                    <span>{artist}</span>
                  ))} */}
                  {song.artists.join(", ")}
                </td>
                <td>{song.ratings}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Songs;
