import React from "react";
import artists from "../datas/artists.json";
import songs from "../datas/songs.json";

const Artists = () => {
  //   console.log(artists);

  let artistsWithSongs = {};
  let artistsWithRatings = {};

  // getting all the songs of each artist and average ratings 
  songs.map((song) => {
    song.artists.map((songArtist) => {
      if (artistsWithSongs[songArtist]) {
        artistsWithSongs[songArtist].push(song.songName);
        artistsWithRatings[songArtist] =
          (artistsWithRatings[songArtist] + song.ratings) /
          artistsWithSongs[songArtist].length;
      } else {
        artistsWithSongs[songArtist] = [song.songName];
        artistsWithRatings[songArtist] = song.ratings;
      }
    });
  });

  // sorting the artists based on ratings
  const sortedArtists = artists.sort((artist1, artist2) => {
    return artistsWithRatings[artist2.name] - artistsWithRatings[artist1.name];
  });

  // getting top 10 artists based on rating
  const top10Artists = sortedArtists.slice(0, 10);


//   console.log(artistsWithRatings);

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
          {top10Artists.map((artist) => {
            return (
              <tr key={artist.name}>
                <td>{artist.name}</td>
                <td>{artist.dob}</td>
                <td>{artistsWithSongs[artist.name].join(", ")}</td>
                <td>{artistsWithRatings[artist.name].toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Artists;
